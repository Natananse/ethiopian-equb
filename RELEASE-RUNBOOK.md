# Ethiopian Equb — Release Runbook

Everything below was verified on 2026-10-17/18 while producing `app-release.apk`
(v1.0.0, 95 MB, package `com.natnael.ethiopianequb`, minSdk 24 / target 36, all 4 ABIs).
The toolchain lives in `~/workspace/tools/` and is fully reusable.

## 1. Rebuild the release APK (one command)

Run everything in a **single** exec from `~/workspace/ethiopian-equb/android`, because
the sandbox egress-proxy password **rotates** — `gradle.properties` and
`JAVA_TOOL_OPTIONS` must be regenerated from the *current* `https_proxy` in the
same invocation as the build.

```bash
cd ~/workspace/ethiopian-equb/android

# 1) Stop any leftover daemon (journal cache lock bites otherwise)
export JAVA_HOME=~/workspace/tools/jdk-21
GRADLE_USER_HOME=~/workspace/tools/gradle-home \
./gradlew --stop >/dev/null 2>&1 || true

# 2) Regen proxy systemProps from the CURRENT https_proxy env (it rotates!)
PROXY_URL="$https_proxy"   # e.g. http://user:TOKEN@proxy:port
python3 - <<'EOF'
import os, re
url = os.environ.get('https_proxy') or os.environ.get('HTTPS_PROXY')
m = re.match(r'https?://(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)', url)
user, pw, host, port = m.groups()
props = f"""systemProp.http.proxyHost={host}
systemProp.http.proxyPort={port}
systemProp.https.proxyHost={host}
systemProp.https.proxyPort={port}
systemProp.http.proxyUser={user}
systemProp.http.proxyPassword={pw}
systemProp.https.proxyUser={user}
systemProp.https.proxyPassword={pw}
systemProp.javax.net.ssl.trustStore=/home/hatch/workspace/tools/gradle-home/truststore.jks
systemProp.javax.net.ssl.trustStorePassword=changeit
org.gradle.java.home=/home/hatch/workspace/tools/jdk-21
org.gradle.java.installations.paths=/home/hatch/workspace/tools/jdk-21,/home/hatch/workspace/tools/jdk-17
org.gradle.java.installations.auto-download=false
org.gradle.parallel=false
"""
open('/home/hatch/workspace/tools/gradle-home/gradle.properties','w').write(props)
EOF

# 3) Rebuild the Java truststore from the CURRENT egress CA (it rotates too)
keytool -importcert -noprompt -trustcacerts \
  -keystore ~/workspace/tools/gradle-home/truststore.jks -storepass changeit \
  -alias hatch-egress -file /etc/ssl/certs/hatch-egress-ca.pem 2>/dev/null || true

# 4) Build — serial only (parallel deadlocks at :app:mergeReleaseNativeLibs)
export JAVA_TOOL_OPTIONS="-Djava.net.preferIPv4Stack=true \
  -Djavax.net.ssl.trustStore=$HOME/workspace/tools/gradle-home/truststore.jks \
  -Djavax.net.ssl.trustStorePassword=changeit"
GRADLE_USER_HOME=~/workspace/tools/gradle-home \
./gradlew assembleRelease --max-workers=1

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Why each of these exists (all hit 2026-10-17, all verified)

| Step | Failure it fixes |
|---|---|
| `-Djava.net.preferIPv4Stack=true` via `JAVA_TOOL_OPTIONS` | Gradle daemon "Could not dispatch/receive a message from the daemon" — the sandbox intercepts Java's dual-stack IPv6 loopback sockets. **Not** the `other_tcp` setting; never touch it. |
| `--stop` before building | Journal cache lock from a leftover daemon kills the next run. |
| Proxy regen in the same exec | `foojay-resolver-convention` "not found" was a stale rotated proxy token in `gradle.properties`. |
| Truststore rebuild | `PKIX` failures from dl.google.com — egress is a TLS MITM with a rotating CA. |
| JDK 17 at `~/workspace/tools/jdk-17` alongside JDK 21 | React Native's Gradle plugin requires a Java 17 toolchain; the daemon itself still runs on JDK 21. |
| `init.d/local-maven.gradle` (allprojects-only) | Two artifacts stall mid-download through the proxy — the 161 MB `react-android` AAR and `com.google.prefab:cli` — both are curl-fetched into `~/workspace/tools/local-maven`. Hooks like `beforeSettings` break settings classpath resolution; keep it `allprojects` only. |
| Serial build (`--max-workers=1`, `parallel=false`) | Parallel deadlocked at `:app:mergeReleaseNativeLibs`. |
| Toolchain paths | JDK 21 `~/workspace/tools/jdk-21`, JDK 17 `~/workspace/tools/jdk-17`, SDK `~/workspace/tools/android-sdk` (platform 36, build-tools 36.0.0, platform-tools, CMake 3.22.1, NDK 27.1.12297006), Gradle 9.3.1 pre-seeded in `~/workspace/tools/gradle-home`. `sdkmanager` can't tunnel through the proxy — fetch SDK zips with curl into `~/workspace/tools/downloads` (not `/tmp`: it's a 512 MB tmpfs). |

Last successful run: 723 tasks, **9m 35s**. Signature check with `apksigner verify` passed.

## 2. Pre-release checklist (before the next build)

1. **`expo-system-ui`** — prebuild warned it's missing; `app.json`
   `userInterfaceStyle: "automatic"` won't apply natively without it. One-liner:
   `npx expo install expo-system-ui` (then rebuild — it's a native change).
2. **Version bump** — `app.json` is `1.0.0`; bump `version` / `android.versionCode`
   for each new release, or testers' phones won't take the update.
3. **Release keystore** (needed before any Play Store upload — current APK is signed
   with the prebuild **debug keystore**; fine for sideload/testing). See §3.

## 3. Release keystore (run only on your word)

Generates a real upload keystore + wires signing into `android/app/build.gradle`.
Keep the keystore file and the password somewhere safe — lose the key and you can
never update the Play Store listing under this package name.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore ~/workspace/ethiopian-equb/android/app/release.keystore \
  -alias equb-upload -keyalg RSA -keysize 2048 -validity 9125

# Then in android/gradle.properties add:
#   EQUb_KEYSTORE_PASSWORD=...
#   EQUb_KEY_ALIAS=equb-upload
#   EQUb_KEY_PASSWORD=...
# and a signingConfigs.release block in android/app/build.gradle reading them.
```

Say the word and this gets set up + the APK rebuilt.

## 4. Still gated (your word needed)

- Branch, push, PR for the refactor + `android/` folder — all local and uncommitted.
- The APK at repo root and `android/app/build/outputs/apk/release/app-release.apk`
  (95 MB, debug-signed) is ready to install/test whenever.
