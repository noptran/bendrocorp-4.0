#!/usr/bin/env bash

set -xeu
set -o pipefail

function finish() {
  ditto -c -k --sequesterRsrc --keepParent "${RESULT_BUNDLE_PATH}" "${RESULT_BUNDLE_PATH}.zip"
  rm -rf "${RESULT_BUNDLE_PATH}"
}

trap finish EXIT

SDK="${SDK:-iphoneos}"
WORKSPACE="${WORKSPACE:-App.xcworkspace}"
SCHEME="${SCHEME:-App}"
CONFIGURATION=${CONFIGURATION:-Release}

BUILD_DIR=${BUILD_DIR:-.build}
ARTIFACT_PATH=${RESULT_PATH:-${BUILD_DIR}/Artifacts}
RESULT_BUNDLE_PATH="${ARTIFACT_PATH}/${SCHEME}.xcresult"
ARCHIVE_PATH=${ARCHIVE_PATH:-${BUILD_DIR}/Archives/${SCHEME}.xcarchive}
DERIVED_DATA_PATH=${DERIVED_DATA_PATH:-${BUILD_DIR}/DerivedData}
CURRENT_PROJECT_VERSION=${BUILD_NUMBER:-0}
EXPORT_OPTIONS_FILE="Support/ExportOptions.plist"

# decrypt the provisioning profile
gpg -d --pinentry-mode=loopback --passphrase "${PROV_KEY}" -o provisioning.mobileprovision provisioning.mobileprovision.gpg

# install it
for PROVISION in `ls ./*.mobileprovision`
do
  UUID=`/usr/libexec/PlistBuddy -c 'Print :UUID' /dev/stdin <<< $(security cms -D -i ./$PROVISION)`
  cp "./$PROVISION" "$HOME/Library/MobileDevice/Provisioning Profiles/$UUID.mobileprovision"
done

# do the export
xcrun xcodebuild \
    -exportArchive \
    -exportOptionsPlist "${EXPORT_OPTIONS_FILE}" \
    -archivePath "${ARCHIVE_PATH}" \
    -exportPath "${ARTIFACT_PATH}/${SCHEME}.ipa"

# Zip up the Xcode Archive into Artifacts folder.
ditto -c -k --sequesterRsrc --keepParent "${ARCHIVE_PATH}" "${ARTIFACT_PATH}/${SCHEME}.xcarchive.zip"