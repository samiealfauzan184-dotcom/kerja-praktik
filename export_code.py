
from pathlib import Path

ROOT = Path(__file__).parent
OUTPUT = ROOT / "semua_codingan.txt"

SKIP_DIRS = {
    ".git", "node_modules", "vendor", "dist",
    "build", "__pycache__", ".idea", ".next"
}

SKIP_FILES = {
    ".env", ".env.local", "export_code.py",
    "semua_codingan.txt", "package-lock.json",
    "composer.lock"
}

EXTENSIONS = {
    ".php", ".html", ".css", ".js", ".jsx",
    ".ts", ".tsx", ".py", ".java", ".kt",
    ".sql", ".json", ".xml", ".yaml", ".yml",
    ".md", ".txt", ".vue", ".svelte"
}

total = 0

with OUTPUT.open("w", encoding="utf-8") as output:
    for file in sorted(ROOT.rglob("*")):
        if not file.is_file():
            continue

        relative = file.relative_to(ROOT)

        if any(part in SKIP_DIRS for part in relative.parts[:-1]):
            continue

        if file.name in SKIP_FILES or file.name.startswith(".env"):
            continue

        if file.suffix.lower() not in EXTENSIONS:
            continue

        # Lewati file yang terlalu besar
        if file.stat().st_size > 200_000:
            continue

        try:
            content = file.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue

        output.write(f"\n{'=' * 60}\n")
        output.write(f"FILE: {relative.as_posix()}\n")
        output.write(f"{'=' * 60}\n\n")
        output.write(content)
        output.write("\n")

        total += 1

print(f"Berhasil menggabungkan {total} file.")
print(f"Hasil tersimpan di: {OUTPUT}")
