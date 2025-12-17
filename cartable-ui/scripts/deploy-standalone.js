/**
 * Deployment Script for Standalone Mode
 * اسکریپت دیپلویمنت برای حالت Standalone
 *
 * این اسکریپت بعد از build، فایل‌های لازم را کپی می‌کند
 */

const fs = require("fs");
const path = require("path");

console.log("📦 Starting standalone deployment setup...\n");

const projectRoot = path.join(__dirname, "..");
const standaloneDir = path.join(projectRoot, ".next/standalone");
const publicDir = path.join(projectRoot, "public");
const staticDir = path.join(projectRoot, ".next/static");

// Helper function to copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Warning: ${src} does not exist, skipping...`);
    return;
  }

  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy public folder
console.log("📁 Copying public folder...");
const standalonePubicDir = path.join(standaloneDir, "public");
copyDir(publicDir, standalonePubicDir);
console.log("✅ Public folder copied\n");

// 2. Copy .next/static folder
console.log("📁 Copying static folder...");
const standaloneStaticDir = path.join(standaloneDir, ".next/static");
copyDir(staticDir, standaloneStaticDir);
console.log("✅ Static folder copied\n");

console.log("🎉 Standalone deployment setup completed successfully!");
console.log("\n📝 Next steps:");
console.log("   1. Create nssm service: CartableUI");
console.log("   2. Check service status");
