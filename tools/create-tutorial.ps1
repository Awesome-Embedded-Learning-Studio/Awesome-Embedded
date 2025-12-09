# Embedded Tutorial Repository Creator Script
# This script creates a standardized template for embedded learning tutorials

# Enable strict mode for better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Variables to track creation state
$createdItems = @()
$rootPath = ""

# Function to cleanup created items
function Remove-CreatedItems {
    Write-Host "`nCleaning up created items..." -ForegroundColor Yellow
    foreach ($item in $createdItems) {
        if (Test-Path $item) {
            Remove-Item -Path $item -Recurse -Force
            Write-Host "Removed: $item" -ForegroundColor Gray
        }
    }
    Write-Host "Cleanup completed." -ForegroundColor Green
}

# Function to handle Ctrl+C interruption
function Handle-Interruption {
    Write-Host "`n`nOperation interrupted by user." -ForegroundColor Yellow
    
    if ($createdItems.Count -gt 0) {
        $response = Read-Host "Do you want to undo all created items? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            Remove-CreatedItems
            Write-Host "`nAll changes have been reverted." -ForegroundColor Green
        } else {
            Write-Host "`nCreated items have been kept." -ForegroundColor Cyan
        }
    }
    
    exit
}

# Register Ctrl+C handler
[Console]::TreatControlCAsInput = $false
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    # Cleanup handler
}

try {
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Embedded Tutorial Repository Creator" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""

    # Step 1: Get target directory path
    $targetPath = ""
    $validPath = $false
    
    Write-Host "Select the location to create the project:" -ForegroundColor Yellow
    Write-Host "  Press Enter to use current directory: $PWD" -ForegroundColor Gray
    Write-Host "  Or enter a custom path" -ForegroundColor Gray
    Write-Host ""
    
    while (-not $validPath) {
        $userInput = Read-Host "Target directory path (leave empty for current directory)"
        
        if ([string]::IsNullOrWhiteSpace($userInput)) {
            $targetPath = $PWD.Path
            $validPath = $true
            Write-Host "Using current directory: $targetPath" -ForegroundColor Cyan
        } else {
            # Resolve relative or absolute path
            try {
                $resolvedPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($userInput)
                
                # Check if path exists
                if (Test-Path $resolvedPath) {
                    # Check if it's a directory
                    if ((Get-Item $resolvedPath).PSIsContainer) {
                        $targetPath = $resolvedPath
                        $validPath = $true
                        Write-Host "Using directory: $targetPath" -ForegroundColor Cyan
                    } else {
                        Write-Host "Error: The specified path is a file, not a directory. Please try again." -ForegroundColor Red
                    }
                } else {
                    # Ask if user wants to create the directory
                    Write-Host "Warning: Directory does not exist: $resolvedPath" -ForegroundColor Yellow
                    $createDir = Read-Host "Do you want to create this directory? (y/n)"
                    
                    if ($createDir -eq 'y' -or $createDir -eq 'Y') {
                        try {
                            New-Item -Path $resolvedPath -ItemType Directory -Force | Out-Null
                            $createdItems += $resolvedPath
                            $targetPath = $resolvedPath
                            $validPath = $true
                            Write-Host "Created directory: $targetPath" -ForegroundColor Green
                        } catch {
                            Write-Host "Error: Failed to create directory. $($_.Exception.Message)" -ForegroundColor Red
                            Write-Host "Please try a different path." -ForegroundColor Yellow
                        }
                    } else {
                        Write-Host "Please enter a different path." -ForegroundColor Yellow
                    }
                }
            } catch {
                Write-Host "Error: Invalid path format. $($_.Exception.Message)" -ForegroundColor Red
                Write-Host "Please try again." -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host ""

    # Step 2: Get project name and create root directory
    $projectName = ""
    while ([string]::IsNullOrWhiteSpace($projectName)) {
        $projectName = Read-Host "Enter the project name (Tutorial Name)"
        if ([string]::IsNullOrWhiteSpace($projectName)) {
            Write-Host "Project name cannot be empty. Please try again." -ForegroundColor Red
        }
    }

    $rootPath = Join-Path -Path $targetPath -ChildPath $projectName
    
    if (Test-Path $rootPath) {
        Write-Host "Error: Directory '$projectName' already exists!" -ForegroundColor Red
        exit 1
    }

    New-Item -Path $rootPath -ItemType Directory | Out-Null
    $createdItems += $rootPath
    Write-Host "Created root directory: $projectName" -ForegroundColor Green
    Write-Host ""

    # Step 3: Create codes_and_assets folder
    $resourcesPath = Join-Path -Path $rootPath -ChildPath "codes_and_assets"
    New-Item -Path $resourcesPath -ItemType Directory | Out-Null
    $resourcesReadMePath = Join-Path -Path  $resourcesPath -ChildPath "instractions.md"
    New-Item -Path $resourcesReadMePath -ItemType File | Out-Null
    Write-Host "Created folder: codes_and_assets" -ForegroundColor Green
    Write-Host "  Purpose: This folder will contain code, PCB files, circuit diagrams, and other teaching resources." -ForegroundColor Gray
    Write-Host ""

    # Step 4: Create tutorial folder
    $documentsPath = Join-Path -Path $rootPath -ChildPath "tutorial"
    New-Item -Path $documentsPath -ItemType Directory | Out-Null
    $documentsReadMePath = Join-Path -Path  $documentsPath -ChildPath "README.md"
    New-Item -Path $documentsReadMePath -ItemType File | Out-Null
    Write-Host "Created folder: tutorial" -ForegroundColor Green
    Write-Host "  Purpose: This folder will contain tutorial documentation and instructional materials." -ForegroundColor Gray
    Write-Host ""

    # Step 5: Create MIT License
    $authorName = ""
    while ([string]::IsNullOrWhiteSpace($authorName)) {
        $authorName = Read-Host "Enter the author's full name (in English) for the MIT License"
        if ([string]::IsNullOrWhiteSpace($authorName)) {
            Write-Host "Author name cannot be empty. Please try again." -ForegroundColor Red
        }
    }

    $currentYear = (Get-Date).Year
    $mitLicenseContent = @"
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

    $licensePath = Join-Path -Path $rootPath -ChildPath "LICENSE"
    Set-Content -Path $licensePath -Value $mitLicenseContent -Encoding UTF8
    Write-Host "Created MIT License file" -ForegroundColor Green
    Write-Host ""

    # Step 6: Create README.md
    $useAuthorName = Read-Host "Use '$authorName' as the README author? (y/n)"
    
    $readmeAuthor = ""
    if ($useAuthorName -eq 'y' -or $useAuthorName -eq 'Y') {
        $readmeAuthor = $authorName
        Write-Host "Using '$authorName' as README author" -ForegroundColor Cyan
    } else {
        while ([string]::IsNullOrWhiteSpace($readmeAuthor)) {
            $readmeAuthor = Read-Host "Enter the author name for README"
            if ([string]::IsNullOrWhiteSpace($readmeAuthor)) {
                Write-Host "Author name cannot be empty. Please try again." -ForegroundColor Red
            }
        }
    }

    $authorEmail = ""
    while ([string]::IsNullOrWhiteSpace($authorEmail)) {
        $authorEmail = Read-Host "Enter the author's email address"
        if ([string]::IsNullOrWhiteSpace($authorEmail)) {
            Write-Host "Email cannot be empty. Please try again." -ForegroundColor Red
        }
    }

    $currentDate = Get-Date -Format "yyyy-MM-dd"
    $readmeContent = @"
# $projectName

本教程创建于: $currentDate
作者: $readmeAuthor
联系方式: $authorEmail

> 本项目隶属于组织[Awesome-Embedded-Learning-Studio](https://github.com/Awesome-Embedded-Learning-Studio)的文档教程

## 快速说明

> codes_and_assets下放置着本教程所有的代码, 或硬件电路图或者是PCB文件等
> 具体的细节，请到[具体的说明步骤🖱](./codes_and_assets/instractions.md)
> tutorial下放置着教程的Markdown文件, 您可以使用其他Markdown浏览器阅读这些教程
> 您如果不知道从何开始，请到[从这里开始!🖱](./tutorial/README.md)查看！

## 这是什么？

## 快速目录
"@

    $readmePath = Join-Path -Path $rootPath -ChildPath "README.md"
    Set-Content -Path $readmePath -Value $readmeContent -Encoding UTF8
    Write-Host "Created README.md file" -ForegroundColor Green
    Write-Host ""

    # Step 7: Display completion and folder path
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Repository structure created successfully!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Project location: $rootPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Directory structure:" -ForegroundColor Yellow
    Write-Host "  $projectName/" -ForegroundColor White
    Write-Host "  ├── ResourcesAndAssets/" -ForegroundColor White
    Write-Host "  ├── Documents/" -ForegroundColor White
    Write-Host "  ├── LICENSE" -ForegroundColor White
    Write-Host "  └── README.md" -ForegroundColor White
    Write-Host ""

    # Step 8: Git initialization
    $initGit = Read-Host "Do you want to initialize this as a Git repository? (y/n)"
    
    if ($initGit -eq 'y' -or $initGit -eq 'Y') {
        Push-Location $rootPath
        
        try {
            # Check if git is available
            git --version 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Error: Git is not installed or not available in PATH." -ForegroundColor Red
                Write-Host "Please install Git and try again." -ForegroundColor Yellow
            } else {
                git init | Out-Null
                git add . | Out-Null
                git commit -m "Initial commit: Project structure created" | Out-Null
                
                Write-Host ""
                Write-Host "Git repository initialized successfully!" -ForegroundColor Green
                Write-Host "Initial commit created with all files." -ForegroundColor Green
            }
        } catch {
            Write-Host "Error during Git initialization: $($_.Exception.Message)" -ForegroundColor Red
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "Git initialization skipped." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "All operations completed successfully!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($createdItems.Count -gt 0) {
        $cleanup = Read-Host "Do you want to cleanup created items? (y/n)"
        if ($cleanup -eq 'y' -or $cleanup -eq 'Y') {
            Remove-CreatedItems
        }
    }
    
    exit 1
}