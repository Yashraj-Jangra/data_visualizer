# Data Visualization Tool

A powerful data visualization tool that allows users to view and edit data through both a web interface and a C++ console application. This project was created as a first-year project for CU (Chandigarh University).

## Features

### Web Interface
- Interactive data visualization using Chart.js
- Multiple chart types (Bar, Line, Pie, Doughnut)
- Real-time data updates
- File selection and management
- Responsive design
- Data editing capabilities

### C++ Console Application
- ASCII-based bar chart visualization
- Data file management
- Add/remove data points
- Multiple file support
- Interactive menu system

## Screenshots

### Web Interface
![Web Interface - Bar Chart](screenshots/web_bar_chart.jpeg)
*Bar Chart Visualization*

![Web Interface - Line Chart](screenshots/web_line_chart.jpeg)
*Line Chart Visualization*

![Web Interface - Pie Chart](screenshots/web_pie_chart.jpeg)
*Pie Chart Visualization*

![Web Interface - Data Editing](screenshots/web_data_editing.jpeg)
*Data Editing Interface*

### C++ Console Application
![C++ Console - Main Menu](screenshots/cpp_main_menu.png)
*Main Menu Interface*

![C++ Console - Bar Chart](screenshots/cpp_bar_chart.png)
*ASCII Bar Chart Visualization*


*c++ Console - Data Management*
![C++ Console - Remove Data Point](screenshots/cpp_data_remove_data.png)
*Remove Data Point*
![C++ Console - Add Data Point](screenshots/cpp_data_add_data.png)
*Add Data Point*
![C++ Console - Display Raw Data](screenshots/cpp_data_display_raw.png)
*Display Raw Data*

## Technologies Used

- Frontend: HTML, CSS, JavaScript, Chart.js
- Backend: C++ (Console Application)
- Data Storage: Plain text files

## Getting Started

### Prerequisites
- Web browser (for web interface)
- C++ compiler (for console application)
- Basic understanding of data files

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yashraj-Jangra/data_visualizer.git
```

2. For web interface:
   - Simply open `index.html` in your web browser (no web server required)
   - Place data files in the `data` directory
   - The application will work directly in your browser

3. For C++ application:
   - Compile the source code:
   ```bash
   g++ visualization.cpp -o visualizer
   ```
   - Run the executable:
   ```bash
   ./visualizer
   ```

## Usage

### Web Interface
1. Open `index.html` in your browser
2. Select a data file from the dropdown
3. Choose a chart type
4. Edit data using the form below the chart
5. Save changes to update the visualization

### C++ Application
1. Run the executable
2. Use the menu to:
   - Display bar charts
   - Show raw data
   - Add/remove data points
   - Load different data files
   - Exit the application

## Data File Format

Data files should be in the following format:
```
name1 value1
name2 value2
name3 value3
```

Example:
```
Apple 10
Banana 15
Orange 20
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **Yashraj Jangra** - [GitHub Profile](https://github.com/Yashraj-Jangra)

## Acknowledgments

- Chart.js for the web visualization library
- CU (Chandigarh University) for the project opportunity 