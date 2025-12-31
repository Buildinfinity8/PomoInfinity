# PomoInfinity 🍅♾️

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**A better Pomodoro timer for managing multiple tasks efficiently.**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack)

</div>

---

## 📖 About

**PomoInfinity** is a Chrome Extension designed to take the standard Pomodoro technique to the next level. Unlike traditional timers that track one session at a time, PomoInfinity allows you to create a dynamic queue of specific work tasks, manage them individually, and visualize your progress with a clean, dark-mode interface.

Whether you are working alone or planning to scale for a team, PomoInfinity helps you visualize time as a tangible resource.

## ✨ Features

* **Multi-Task Management:** Create and queue multiple timers for different tasks (e.g., "Coding", "Emails", "Design").
* **Dynamic Visuals:**
    * Main display shows the active timer with a dynamic conic-gradient border animation based on the remaining seconds.
    * Clean Dark Mode UI designed to reduce eye strain.
* **Customizable Durations:** Set specific hours, minutes, and seconds for every individual task.
* **Task Controls:** Play, pause, and delete individual tasks. The system automatically prioritizes active tasks.
* **Notification System:** Built-in in-app notifications for alerts, errors, and success states.
* **Persistent State:** Uses `chrome.storage` to ensure your data isn't lost when the popup closes.

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Extension API:** Chrome Manifest V3
* **Styling:**
    * CSS Grid & Flexbox
    * CSS Variables for theming (`--col-background`, `--timeangle`)
    * Custom Fonts: *Arvo* and *Gorditas*
* **Data Persistence:** Chrome Storage API

## 📥 Installation

Since this extension is currently in development (or not yet on the Web Store), you can install it using **Developer Mode**:

1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click the **Load unpacked** button.
5.  Select the folder containing this project (the folder where `manifest.json` is located).
6.  The **PomoInfinity** icon should now appear in your browser toolbar!

## 🚀 Usage

1.  **Open the Extension:** Click the PomoInfinity logo in your browser toolbar.
2.  **Add a Task:**
    * Click the **+** (Plus) button to open the "New Clock" form.
    * Enter a **Task Name** (e.g., "Fix Bug #12").
    * Set the **Duration** (HH:MM:SS).
    * Click the Add button.
3.  **Manage Tasks:**
    * **Play/Pause:** Click the play/pause icon on any specific task. The main large timer at the top will always reflect the top-most active task.
    * **Remove:** Click the **X** to remove a completed or unwanted task.
4.  **Focus:** Watch the gradient border animate as you work through your list!

## 📂 Project Structure

```text
PomoInfinity/
├── manifest.json       # Extension configuration (V3)
├── popup.html          # Main UI structure
├── files/
│   ├── style.css       # Dark mode styling & animations
│   ├── script.js       # Timer logic, state management, DOM manipulation
│   └── images/         # Icons (logo.png, play.png, etc.)
└── README.md           # Documentation
