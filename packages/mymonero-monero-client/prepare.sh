#!/usr/bin/env bash

set -e # Exit on any error

# Dependencies

## These should be audited!
# Use the webassembly-cleanup branch:
mymonero_core_cpp_url='https://github.com/mymonero/mymonero-core-cpp'
mymonero_core_cpp_hash='005fcf096ef429ddc157f489d69b1d3ca7d16244'

# Use the master branch:
monero_core_custom_url='https://github.com/mymonero/monero-core-custom'
monero_core_custom_hash='936afd97467375511032d6a4eef6e76c982148dd'

if [ "$(basename "$(pwd)")" != "mymonero-monero-client" ]; then
  echo "Should be ran from the repo dir!"
  exit 1
fi

function clonerepo { # source, target, commit
  rm -rf "$2"
  oldpwd="$(pwd)"

  git clone "${1}" "${2}" || exit 1
  cd "$2"
  git reset --hard "$3" || exit 1
  if [ "$(git rev-parse HEAD)" != "$3" ]; then
    echo "Wrong HEAD!"
    exit 1
  fi

  cd "$oldpwd"
}

# Clone dependencies

echo "Cloning dependencies..."
rm -rf 'src/submodules' && mkdir -p 'src/submodules'
clonerepo "${mymonero_core_cpp_url}" 'src/submodules/mymonero-core-cpp' "${mymonero_core_cpp_hash}"
clonerepo "${monero_core_custom_url}" 'src/submodules/monero-core-custom' "${monero_core_custom_hash}"

# Prepare for build

echo "Clearing the build dir..."
rm -rf build && mkdir build

# Finished

echo "All done! We are prepared for the build now."