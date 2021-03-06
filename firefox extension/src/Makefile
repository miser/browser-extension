# The name of the extension.
extension_name := newmknotewebclipper

# The UUID of the extension.
extension_uuid := newwebclipper@mknote.com

# The name of the profile dir where the extension can be installed.
profile_dir := 8h6n0gwq.dev

# The zip application to be used.
ZIP := zip

# The target location of the build and build files.
bin_dir := ../bin

# The target XPI file.
xpi_file := $(bin_dir)/$(extension_name)2.xpi

# The type of operating system this make command is running on.
os_type := $(patsubst darwin%,darwin,$(shell echo $(OSTYPE)))

# The location of the extension profile.
ifeq ($(os_type), darwin)
  profile_location := \
    ~/Library/Application\ Support/Firefox/Profiles/$(profile_dir)/extensions/\{$(extension_uuid)\}
else
  ifeq ($(os_type), linux-gnu)
    profile_location := \
      ~/.mozilla/firefox/$(profile_dir)/extensions/\{$(extension_uuid)\}
  else
    profile_location := \
      "$(subst \,\\,$(APPDATA))\\Mozilla\\Firefox\\Profiles\\$(profile_dir)\\extensions\\$(extension_uuid).xpi"
  endif
endif

# The temporary location where the extension tree will be copied and built.
build_dir := $(bin_dir)

# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

# This cleans all temporary files and directories created by 'make'.
.PHONY: clean
clean:
	@rm -rf $(build_dir)
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

# The sources for the XPI file.
xpi_built := install.rdf \
             chrome.manifest \
             $(wildcard chrome/content/js/*.js) \
             $(wildcard chrome/content/js/lib/*.js) \
             $(wildcard chrome/content/css/*.css) \
             $(wildcard chrome/content/css/images/*.png) \
             $(wildcard chrome/content/images/*.png) \
             $(wildcard chrome/content/images/*/*.png) \
             $(wildcard chrome/content/*.html) \
             $(wildcard chrome/content/*.xul) \
             $(wildcard chrome/skin/classic/*.css) \
	     $(wildcard chrome/skin/classic/*.png) \
	     $(wildcard chrome/skin/classic/*/*.png) \
             $(wildcard chrome/locale/*/*.dtd) \
             $(wildcard chrome/locale/*/*.properties)

# This builds everything except for the actual XPI, and then it copies it to the
# specified profile directory, allowing a quick update that requires no install.
.PHONY: install
install: $(build_dir) $(xpi_built)
	@echo "Installing in profile folder: $(profile_location)"
	@cp -Rf $(build_dir)/* $(profile_location)
	@echo "Installing in profile folder. Done!"
	@echo


$(xpi_file): $(xpi_built)
	@echo "Creating XPI file."
	@$(ZIP) $(xpi_file) $(xpi_built)
	@echo "Creating XPI file. Done!"
	@echo "Installing in profile folder: $(profile_location)"
	@sleep 1
	@cp -Rf $(build_dir)/* $(profile_location)
	@echo "Installing in profile folder. Done!"
	@echo
	@echo "Kill firefox"
	@taskkill /f /im firefox.exe /fi "STATUS eq RUNNING"
	@echo "Restart firefox"
	@sleep 1
	@firefox.exe -jsconsole
	@echo "Restart firefox success"
