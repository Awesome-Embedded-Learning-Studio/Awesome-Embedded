# Embedded Tutorial Repository Setup Script
# This script creates a standardized folder structure for embedded system tutorials

# Error handling and cleanup function
$script:createdItems = @()
$script:projectPath = ""

function Cleanup-OnCancel {
    Write-Host "`n`n⚠️  Script interrupted by user." -ForegroundColor Yellow
    $confirm = Read-Host "Do you want to rollback all created files and folders? (y/n)"
    
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        Write-Host "`n🔄 Rolling back changes..." -ForegroundColor Cyan
        
        if ($script:projectPath -and (Test-Path $script:projectPath)) {
            try {
                Remove-Item -Path $script:projectPath -Recurse -Force
                Write-Host "✅ Successfully removed project folder: $script:projectPath" -ForegroundColor Green
            }
            catch {
                Write-Host "❌ Error removing folder: $_" -ForegroundColor Red
            }
        }
        
        Write-Host "✅ Rollback completed." -ForegroundColor Green
    }
    else {
        Write-Host "ℹ️  Changes preserved. Project folder remains at: $script:projectPath" -ForegroundColor Cyan
    }
    
    exit
}

# Set up Ctrl+C handler
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Cleanup-OnCancel
}

try {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Embedded Project Repository Setup" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    # Step 1: Get target directory path
    Write-Host "📂 Select project creation location" -ForegroundColor Cyan
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Gray
    $useCurrentDir = Read-Host "Create project in current directory? (y/n)"
    
    $targetPath = ""
    if ($useCurrentDir -eq 'y' -or $useCurrentDir -eq 'Y') {
        $targetPath = Get-Location
        Write-Host "✅ Using current directory`n" -ForegroundColor Green
    }
    else {
        do {
            $customPath = Read-Host "📝 Enter the full path where you want to create the project"
            
            if ([string]::IsNullOrWhiteSpace($customPath)) {
                Write-Host "❌ Path cannot be empty. Please try again." -ForegroundColor Red
                continue
            }
            
            # Test if path exists
            if (-not (Test-Path $customPath)) {
                Write-Host "⚠️  Path does not exist: $customPath" -ForegroundColor Yellow
                $createPath = Read-Host "Do you want to create this directory? (y/n)"
                
                if ($createPath -eq 'y' -or $createPath -eq 'Y') {
                    try {
                        New-Item -ItemType Directory -Path $customPath -Force -ErrorAction Stop | Out-Null
                        $targetPath = $customPath
                        Write-Host "✅ Created directory: $customPath`n" -ForegroundColor Green
                        break
                    }
                    catch {
                        Write-Host "❌ Error creating directory: $_" -ForegroundColor Red
                        Write-Host "Please try a different path." -ForegroundColor Yellow
                    }
                }
            }
            else {
                # Test if path is writable
                $testFile = Join-Path $customPath ".write_test_$(Get-Random)"
                try {
                    New-Item -ItemType File -Path $testFile -ErrorAction Stop | Out-Null
                    Remove-Item -Path $testFile -Force
                    $targetPath = $customPath
                    Write-Host "✅ Using directory: $customPath`n" -ForegroundColor Green
                    break
                }
                catch {
                    Write-Host "❌ Error: No write permission for this directory" -ForegroundColor Red
                    Write-Host "Please try a different path." -ForegroundColor Yellow
                }
            }
        } while ($true)
    }

    # Step 2: Get project name
    do {
        $projectName = Read-Host "📝 Enter the project name (Tutorial Name)"
        if ([string]::IsNullOrWhiteSpace($projectName)) {
            Write-Host "❌ Project name cannot be empty. Please try again." -ForegroundColor Red
        }
    } while ([string]::IsNullOrWhiteSpace($projectName))

    # Create project directory
    $script:projectPath = Join-Path $targetPath $projectName
    
    if (Test-Path $script:projectPath) {
        Write-Host "❌ Error: Directory '$projectName' already exists!" -ForegroundColor Red
        exit 1
    }

    try {
        New-Item -ItemType Directory -Path $script:projectPath -ErrorAction Stop | Out-Null
        Write-Host "✅ Created project directory: $projectName`n" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error creating project directory: $_" -ForegroundColor Red
        exit 1
    }

    # Step 2: Create software_codes folder
    Write-Host "📁 Creating 'software_codes' folder..." -ForegroundColor Cyan
    Write-Host "   Purpose: This folder will store all software code files" -ForegroundColor Gray
    $software_codes_folder_path = Join-Path $script:projectPath "software_codes"
    New-Item -ItemType Directory -Path $software_codes_folder_path | Out-Null
    New-Item -ItemType File -Path (Join-Path $software_codes_folder_path "index.md") | Out-Null
    Write-Host "✅ Created successfully`n" -ForegroundColor Green

    # Step 3: Create hardware_asset folder
    Write-Host "📁 Creating 'hardware_asset' folder..." -ForegroundColor Cyan
    Write-Host "   Purpose: This folder will store PCB designs and hardware schematics" -ForegroundColor Gray

    $hardware_asset_folder = Join-Path $script:projectPath "hardware_asset"
    New-Item -ItemType Directory -Path $hardware_asset_folder | Out-Null

    # Create index.md inside hardware_asset
    New-Item -ItemType File -Path (Join-Path $hardware_asset_folder "index.md") | Out-Null
    Write-Host "   ➕ Added hardware_asset/index.md" -ForegroundColor Gray

    Write-Host "✅ Created successfully`n" -ForegroundColor Green


    # Step 4: Create documents folder
    Write-Host "📁 Creating 'documents' folder..." -ForegroundColor Cyan
    Write-Host "   Purpose: This folder will store project documentation" -ForegroundColor Gray

    $documents_folder = Join-Path $script:projectPath "documents"
    New-Item -ItemType Directory -Path $documents_folder | Out-Null

    # Create index.md inside documents
    New-Item -ItemType File -Path (Join-Path $documents_folder "index.md") | Out-Null
    Write-Host "   ➕ Added documents/index.md" -ForegroundColor Gray

    Write-Host "✅ Created successfully`n" -ForegroundColor Green


    # Step 5: Optional tutorial folder
    Write-Host "📁 Optional: 'tutorial' folder" -ForegroundColor Cyan
    Write-Host "   Purpose: This folder will store tutorial materials and guides" -ForegroundColor Gray

    $createTutorial = Read-Host "Do you want to create a 'tutorial' folder? (y/n)"

    if ($createTutorial -eq 'y' -or $createTutorial -eq 'Y') {

        $tutorial_folder = Join-Path $script:projectPath "tutorial"
        New-Item -ItemType Directory -Path $tutorial_folder | Out-Null

        # Create index.md inside tutorial
        New-Item -ItemType File -Path (Join-Path $tutorial_folder "index.md") | Out-Null
        Write-Host "   ➕ Added tutorial/index.md" -ForegroundColor Gray

        Write-Host "✅ Created tutorial folder`n" -ForegroundColor Green
    }
    else {
        Write-Host "ℹ️  Skipped tutorial folder creation`n" -ForegroundColor Yellow
    }
    # Step 6: Create MIT License
    do {
        $authorName = Read-Host "📝 Enter the author's name (in English) for MIT License"
        if ([string]::IsNullOrWhiteSpace($authorName)) {
            Write-Host "❌ Author name cannot be empty. Please try again." -ForegroundColor Red
        }
    } while ([string]::IsNullOrWhiteSpace($authorName))

    $currentYear = Get-Date -Format "yyyy"
    $mitLicense = @"
MIT License

Copyright (c) $currentYear $authorName

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@

    $licensePath = Join-Path $script:projectPath "LICENSE"
    $mitLicense | Out-File -FilePath $licensePath -Encoding UTF8
    Write-Host "✅ Created MIT License`n" -ForegroundColor Green

    # Step 7: Create README
    $useSameAuthor = Read-Host "📝 Use the same author name ($authorName) for README? (y/n)"
    
    if ($useSameAuthor -ne 'y' -and $useSameAuthor -ne 'Y') {
        do {
            $authorName = Read-Host "📝 Enter the author name for README"
            if ([string]::IsNullOrWhiteSpace($authorName)) {
                Write-Host "❌ Author name cannot be empty. Please try again." -ForegroundColor Red
            }
        } while ([string]::IsNullOrWhiteSpace($authorName))
    }

    do {
        $email = Read-Host "📧 Enter the author's email address"
        if ([string]::IsNullOrWhiteSpace($email)) {
            Write-Host "❌ Email cannot be empty. Please try again." -ForegroundColor Red
        }
    } while ([string]::IsNullOrWhiteSpace($email))

    $currentDate = Get-Date -Format "yyyy-MM-dd"
    $readme = @"
# $projectName✨

📅 本教程创建于: $currentDate
👨‍💻 作者： $authorName
📮 联系方式： $email

> 本项目隶属于组织[Awesome-Embedded-Learning-Studio](https://github.com/Awesome-Embedded-Learning-Studio)的文档教程

## 快速说明

> [software_codes](./software_codes)下放置着本项目的软件代码
> [hardware_asset](./hardware_asset) 放置着所有的硬件电路图和PCB文件等
> [documents](./documents) 是本项目的文档
> 如果本项目计划出教学项目, 则会还有[tutorial](./tutorial)文件夹
> 具体的细节，请到[具体的说明步骤🖱](./codes_and_assets/instractions.md)
> 您如果不知道从何开始，请到[从这里开始!🖱](./tutorial/README.md)查看！

## 🚀 这是什么？

## 🚀 快速演示！
"@

    $readmePath = Join-Path $script:projectPath "README.md"
    $readme | Out-File -FilePath $readmePath -Encoding UTF8
    Write-Host "✅ Created README.md`n" -ForegroundColor Green

    # Step 8: Completion message and Git initialization prompt
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Project Setup Completed!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    Write-Host "📂 Project location: $script:projectPath`n" -ForegroundColor Cyan

    $initGit = Read-Host "🔧 Do you want to initialize a Git repository? (y/n)"

    # Step 9: Git initialization
    if ($initGit -eq 'y' -or $initGit -eq 'Y') {
        Write-Host "`n🔧 Initializing Git repository..." -ForegroundColor Cyan
        
        Push-Location $script:projectPath
        
        try {
            git init 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Git repository initialized successfully!" -ForegroundColor Green
                
                # Create .gitignore
                $gitignore = @"
# Build outputs
*.o
*.exe
*.hex
*.bin
*.elf

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
"@
                $gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
                Write-Host "✅ Created .gitignore file" -ForegroundColor Green
            }
            else {
                Write-Host "⚠️  Git initialization failed. Please ensure Git is installed." -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "⚠️  Git initialization failed: $_" -ForegroundColor Yellow
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host "ℹ️  Skipped Git initialization" -ForegroundColor Yellow
    }

    Write-Host "`n🎉 All done! Your embedded tutorial repository is ready." -ForegroundColor Green
    Write-Host "📂 Navigate to: cd $projectName`n" -ForegroundColor Cyan
}
catch {
    Write-Host "`n❌ An error occurred: $_" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
}
finally {
    # Unregister the event handler
    Unregister-Event -SourceIdentifier PowerShell.Exiting -ErrorAction SilentlyContinue
}