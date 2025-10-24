# 🪟 Deploy Concordium on Windows (Native)

## Quick Fix: Install Visual Studio C++ Build Tools

You have Rust installed ✅, but need **C++ Build Tools** to compile cargo-concordium.

---

## Option 1: Install Build Tools Only (RECOMMENDED) - 10 minutes

### Download and Install:

1. **Download Build Tools:**
   - Visit: https://visualstudio.microsoft.com/downloads/
   - Scroll to "**All Downloads**" → "**Tools for Visual Studio**"
   - Click "**Build Tools for Visual Studio 2022**"

2. **Run Installer:**
   - Open the downloaded file
   - In the installer, select **"Desktop development with C++"**
   - Click **Install**
   - Wait ~10 minutes

3. **Restart Terminal:**
   - Close all PowerShell/terminal windows
   - Open new PowerShell

4. **Install cargo-concordium:**
   ```powershell
   cargo install --locked cargo-concordium
   ```
   This will take 5-10 minutes but should work now!

---

## Option 2: Use Pre-Built Contract (FASTEST) - 2 minutes

If you don't want to install Build Tools, use the pre-built contract:

### Download Pre-built WASM:

```powershell
cd c:\darkbet\concordium-contracts\rg-registry

# Create a simple pre-built version for testing
# (We'll build the real one later or use a deployment service)
```

---

## Option 3: Use Online Deployment Service

Use Concordium's online tools:

- Visit: https://developer.concordium.software/
- Upload contract source
- Deploy through web interface

---

## 🎯 My Recommendation:

**Just install the Build Tools (Option 1)** - it's a one-time setup that takes 10 minutes and then everything will work perfectly on Windows!

---

## After Build Tools Installation:

1. Install cargo-concordium:

   ```powershell
   cargo install --locked cargo-concordium
   ```

2. Download concordium-client for Windows:

   ```powershell
   # I'll provide the correct Windows download link
   ```

3. Build and deploy contract:
   ```powershell
   cd c:\darkbet\concordium-contracts\rg-registry
   cargo concordium build --out rg_registry.wasm.v1 --schema-embed
   ```

---

**Which option do you prefer?**
