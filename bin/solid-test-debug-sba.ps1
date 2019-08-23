# use chrome's dev tools to debug the project
# use localhost:9229 in case debugger did not attach automatically
# add project root to sources --> filesystem
# start debugging!

# start the solid server with node in debug mode
node --inspect .\bin\solid-debug-sba.js start

# prevent powershell to close instantly
Read-Host  