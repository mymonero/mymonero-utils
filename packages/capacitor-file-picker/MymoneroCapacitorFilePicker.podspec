
  Pod::Spec.new do |s|
    s.name = 'MymoneroCapacitorFilePicker'
    s.version = '0.0.1'
    s.summary = 'This plugin presents the native UI for picking a file.'
    s.license = 'MIT'
    s.homepage = 'https://github.com/mymonero/mymonero-utils'
    s.author = 'Jose Martinez'
    s.source = { :git => 'https://github.com/mymonero/mymonero-utils', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '12.0'
    s.dependency 'Capacitor'
  end