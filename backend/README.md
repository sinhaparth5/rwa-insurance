# RWA Insurance Backend

### Install and Run backend 

#### Option 1: Using PIP
```bash
# Create Virtual Environment
python -m venv .venv
.venv/Scripts/activate   # Windows
source .venv/bin/activate   # Mac/Linux

python -m pip install -r requirements.txt   # Install packages

python main.py  # To run project
```

#### Option 2: Using UV Python package manager
```bash
# Create Virtual Environment
uv venv
.venv/Scripts/activate   # Windows
source .venv/bin/activate   # Mac/Linux

uv add -r requirements.txt  # Install packages

uv run main.py  # Run project
```
