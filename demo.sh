#!/bin/bash

# Colors for output
G='\033[0;32m'  # Green
R='\033[0;31m'  # Red
Y='\033[1;33m'  # Yellow
NC='\033[0m'    # No Color

# Base URL for assets
BASE_URL="https://raw.githubusercontent.com/floatphp/.github/refs/heads/main/profile/assets"

# Target directories
TEMP_DIR="temp_assets"
FRONT_IMG_DIR="public/assets/front/img"
ADMIN_IMG_DIR="public/assets/admin/img"

# Create all necessary directories
echo -e "${Y}Creating directory structure...${NC}"
mkdir -p "$TEMP_DIR"
mkdir -p "$FRONT_IMG_DIR"
mkdir -p "$ADMIN_IMG_DIR"

# Function to copy file to destination(s)
copy_to_destinations() {
    local file=$1
    shift
    local destinations=("$@")
    
    for dest in "${destinations[@]}"; do
        echo -e "${Y}  → Copying $file to $dest${NC}"
        if cp "$TEMP_DIR/$file" "$dest/$file"; then
            echo -e "${G}    ✓ Successfully copied to $dest${NC}"
        else
            echo -e "${R}    ✗ Failed to copy to $dest${NC}"
        fi
    done
}

# Asset configuration: filename and destination directories
declare -A ASSET_DESTINATIONS=(
    ["header.png"]="$FRONT_IMG_DIR"
    ["logo.png"]="$FRONT_IMG_DIR"
    ["avatar.png"]="$ADMIN_IMG_DIR"
    ["favicon.png"]="$FRONT_IMG_DIR $ADMIN_IMG_DIR"
    ["default.png"]="$FRONT_IMG_DIR $ADMIN_IMG_DIR"
)

echo -e "${G}Starting download of remote assets...${NC}"
echo

# Download and distribute each asset
for asset in "${!ASSET_DESTINATIONS[@]}"; do
    echo -e "${Y}Processing: $asset${NC}"
    
    # Download to temporary directory
    if command -v curl &> /dev/null; then
        if curl -L --progress-bar "$BASE_URL/$asset" -o "$TEMP_DIR/$asset"; then
            echo -e "${G}✓ Successfully downloaded: $asset${NC}"
        else
            echo -e "${R}✗ Failed to download: $asset${NC}"
            continue
        fi
    elif command -v wget &> /dev/null; then
        if wget --progress=bar:force:noscroll "$BASE_URL/$asset" -O "$TEMP_DIR/$asset"; then
            echo -e "${G}✓ Successfully downloaded: $asset${NC}"
        else
            echo -e "${R}✗ Failed to download: $asset${NC}"
            continue
        fi
    else
        echo -e "${R}Error: Neither curl nor wget is available${NC}"
        exit 1
    fi
    
    # Copy to destination directories
    IFS=' ' read -ra destinations <<< "${ASSET_DESTINATIONS[$asset]}"
    copy_to_destinations "$asset" "${destinations[@]}"
    
    echo
done

# Clean up temporary directory
echo -e "${Y}Cleaning up temporary files...${NC}"
rm -rf "$TEMP_DIR"

echo -e "${G}Asset download and distribution completed!${NC}"

# Show summary of distributed files
echo
echo -e "${Y}Asset distribution summary:${NC}"
echo -e "${Y}Front assets (public/assets/front/img/):${NC}"
ls -la "$FRONT_IMG_DIR"/*.png 2>/dev/null || echo -e "${R}  No PNG files found${NC}"
echo
echo -e "${Y}Admin assets (public/assets/admin/img/):${NC}"
ls -la "$ADMIN_IMG_DIR"/*.png 2>/dev/null || echo -e "${R}  No PNG files found${NC}"