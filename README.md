# 🔗 BFHL Node Hierarchy Explorer

A full-stack web application that processes directed node relationships to construct hierarchical trees, detect cycles, and validate inputs.

Built as part of the **Bajaj Finserv Health Limited (BFHL) Challenge** at SRM Institute of Science and Technology.

---

## 🚀 Live Demo

* 🌐 **Frontend (Netlify):** https://gilded-dodol-b17c79.netlify.app/
* 🔗 **Backend API (Render):**https://bajajfinserv-diqu.onrender.com/

---

## 📌 Overview

This application accepts node relationships in the format `A->B` and performs:

* Tree construction from valid edges
* Cycle detection in graphs
* Identification of invalid inputs
* Detection of duplicate edges
* Summary generation for analysis

---

## ✨ Features

* 🌳 **Hierarchy Builder** – Converts edges into tree structures
* 🔁 **Cycle Detection** – Identifies cyclic dependencies
* ⚠️ **Validation Engine** – Filters invalid inputs
* 🔄 **Duplicate Detection** – Flags repeated edges
* 📊 **Summary Dashboard** – Displays trees, cycles, largest root
* 🎨 **Interactive UI** – Clean and responsive frontend

---

## 🧠 Input Format

### ✔ Option 1: Text Input

```
A->B, A->C, B->D
```

### ✔ Option 2: JSON Input

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

---

## 📤 Output Format

```json
{
  "user_id": "sujalfuldevare_17091999",
  "email_id": "xxx@srmist.edu.in",
  "college_roll_number": "RA23110030117xx",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 🏗️ Tech Stack

### Frontend

* HTML5, CSS3, JavaScript
* Hosted on **Netlify**

### Backend

* Node.js
* Express.js
* Hosted on **Render**

---

## ⚙️ Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       └── processor.js
│
├── frontend/
│   └── index.html
│
└── README.md
```

---

## 🧪 API Endpoint

### POST `/bfhl`

#### Request

```json
{
  "data": ["A->B", "B->C"]
}
```

#### Response

Returns structured hierarchy, validation results, and summary.

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run server

```bash
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## 🌐 Deployment

* **Backend:** Deployed on Render
* **Frontend:** Deployed on Netlify

---

## 📊 Example Test Input

```
A->B, A->C, B->D, C->E, E->F,
X->Y, Y->Z, Z->X,
G->H, G->H, G->I,
hello, 1->2, A->
```

---

## 🧩 Edge Cases Handled

* Duplicate edges
* Invalid formats (`hello`, `A->`)
* Self loops (`A->A`)
* Multiple parents (diamond structure)
* Cyclic graphs

---

## 👨‍💻 Author

**Sujal Fuldevare**

* 🎓 SRM Institute of Science and Technology
* 💻 Web Developer | Problem Solver

---

## 📜 License

This project is created for academic and evaluation purposes.

---

## ⭐ Acknowledgement

Developed as part of the **BFHL Technical Challenge**, focusing on problem-solving, data structures, and system design.
