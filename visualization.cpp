#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <string>
#include <windows.h>
#include <tchar.h>

using namespace std;

struct DataPoint {
    string name;
    int value;
};

class DataVisualizer {
private:
    vector<DataPoint> data;
    const char BAR_CHAR = '#';
    const char HALF_BAR = '-';
    const int CHART_WIDTH = 50;
    const int NAME_WIDTH = 15;
    string currentFile;
    
public:
    // Constructor
    DataVisualizer() : currentFile("") {}

    // Get list of data files
    vector<string> getDataFiles() {
        vector<string> files;
        WIN32_FIND_DATA findFileData;
        HANDLE hFind;

        // Check if data directory exists, if not create it
        if (GetFileAttributes("data") == INVALID_FILE_ATTRIBUTES) {
            CreateDirectory("data", NULL);
        }

        string searchPath = "data\\*.txt";
        hFind = FindFirstFile(searchPath.c_str(), &findFileData);

        if (hFind != INVALID_HANDLE_VALUE) {
            do {
                if (!(findFileData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)) {
                    files.push_back("data/" + string(findFileData.cFileName));
                }
            } while (FindNextFile(hFind, &findFileData) != 0);
            FindClose(hFind);
        }

        return files;
    }

    // Read data from file
    bool readDataFromFile(const string& filename) {
        ifstream file(filename);
        if (!file.is_open()) {
            cout << "Error: Could not open file " << filename << endl;
            return false;
        }

        currentFile = filename;
        data.clear();
        string name;
        int value;
        while (file >> name >> value) {
            data.push_back({name, value});
        }
        file.close();
        return true;
    }

    // Save data to file
    bool saveDataToFile() {
        if (currentFile.empty()) {
            cout << "Error: No file is currently loaded." << endl;
            return false;
        }

        ofstream file(currentFile);
        if (!file.is_open()) {
            cout << "Error: Could not open file for writing." << endl;
            return false;
        }

        for (const auto& point : data) {
            file << point.name << " " << point.value << endl;
        }
        file.close();
        return true;
    }

    // Add data
    void addData() {
        string name;
        int value;

        cout << "\n=== Add New Data Point ===\n";
        cout << "Enter name (no spaces): ";
        cin >> name;
        
        cout << "Enter value: ";
        while (!(cin >> value)) {
            cout << "Invalid input. Please enter a number: ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        data.push_back({name, value});
        cout << "Data point added successfully!\n";
        saveDataToFile();
    }

    // Remove data
    void removeData() {
        if (data.empty()) {
            cout << "No data to remove!\n";
            return;
        }

        cout << "\n=== Remove Data Point ===\n";
        cout << "Current data points:\n";
        for (size_t i = 0; i < data.size(); i++) {
            cout << i + 1 << ". " << data[i].name << ": " << data[i].value << endl;
        }

        cout << "Enter the number of the data point to remove (1-" << data.size() << "): ";
        int choice;
        while (!(cin >> choice) || choice < 1 || choice > static_cast<int>(data.size())) {
            cout << "Invalid input. Please enter a number between 1 and " << data.size() << ": ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        data.erase(data.begin() + choice - 1);
        cout << "Data point removed successfully!\n";
        saveDataToFile();
    }

    // Load data file
    void loadDataFile() {
        vector<string> files = getDataFiles();
        if (files.empty()) {
            cout << "No data files found in the data directory!\n";
            return;
        }

        cout << "\n=== Available Data Files ===\n";
        for (size_t i = 0; i < files.size(); i++) {
            cout << i + 1 << ". " << files[i] << endl;
        }

        cout << "Enter your choice (1-" << files.size() << "): ";
        int choice;
        while (!(cin >> choice) || choice < 1 || choice > static_cast<int>(files.size())) {
            cout << "Invalid input. Please enter a number between 1 and " << files.size() << ": ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        if (readDataFromFile(files[choice - 1])) {
            cout << "Successfully loaded " << files[choice - 1] << endl;
        }
    }

    void showMenu() {
        while (true) {
            cout << "\n+================================+\n";
            cout << "|    Data Visualization Tool     |\n";
            cout << "+================================+\n";
            cout << "| 1. Display Bar Chart          |\n";
            cout << "| 2. Show Raw Data              |\n";
            cout << "| 3. Add Data Point             |\n";
            cout << "| 4. Remove Data Point          |\n";
            cout << "| 5. Load Different Data File   |\n";
            cout << "| 0. Exit                       |\n";
            cout << "+================================+\n";
            cout << "Enter your choice: ";

            int choice;
            cin >> choice;

            switch (choice) {
                case 1:
                    displayBarChart();
                    break;
                case 2:
                    showRawData();
                    break;
                case 3:
                    addData();
                    break;
                case 4:
                    removeData();
                    break;
                case 5:
                    loadDataFile();
                    break;
                case 0:
                    return;
                default:
                    cout << "Invalid choice. Please try again.\n";
            }
        }
    }

    // Display the bar chart
    void displayBarChart() {
        if (data.empty()) {
            cout << "No data to display!\n";
            return;
        }

        int maxValue = 0;
        for (const auto& point : data) {
            maxValue = max(maxValue, point.value);
        }

        // Calculate scale factor
        double scale = static_cast<double>(CHART_WIDTH) / maxValue;
        
        // Calculate units per block (rounded to 1 decimal place)
        double unitsPerBlock = static_cast<double>(maxValue) / CHART_WIDTH;
        // Ensure we don't show 0 units per block
        if (unitsPerBlock < 0.1) {
            unitsPerBlock = 0.1;
        }

        // Print header
        cout << "\n+=" << string(CHART_WIDTH + NAME_WIDTH + 15, '=') << "+\n";
        cout << "| Bar Chart - Each " << BAR_CHAR << " represents " 
             << fixed << setprecision(1) << unitsPerBlock << " units\n";
        cout << "+-" << string(CHART_WIDTH + NAME_WIDTH + 15, '-') << "+\n";

        // Print bars
        for (const auto& point : data) {
            // Print name with fixed width
            cout << "| " << left << setw(NAME_WIDTH) << point.name << "| ";

            // Calculate full and partial blocks
            int fullBlocks = static_cast<int>(point.value * scale);
            double remainder = (point.value * scale) - fullBlocks;
            
            // Print the bars
            cout << string(fullBlocks, BAR_CHAR);
            if (remainder > 0.5) {
                cout << HALF_BAR;
            }
            
            // Print the value
            cout << right << setw(CHART_WIDTH - fullBlocks + 5) << point.value << " |\n";
        }

        // Print footer
        cout << "+" << string(CHART_WIDTH + NAME_WIDTH + 15, '=') << "+\n";
    }

    // Show raw data
    void showRawData() {
        if (data.empty()) {
            cout << "No data to display!\n";
            return;
        }

        cout << "\n+=" << string(NAME_WIDTH + 12, '=') << "+\n";
        cout << "| " << left << setw(NAME_WIDTH) << "Name" << "| Value    |\n";
        cout << "+-" << string(NAME_WIDTH + 12, '-') << "+\n";
        
        for (const auto& point : data) {
            cout << "| " << left << setw(NAME_WIDTH) << point.name 
                 << "| " << right << setw(7) << point.value << " |\n";
        }
        
        cout << "+" << string(NAME_WIDTH + 12, '=') << "+\n";
    }
};

int main() {
    DataVisualizer visualizer;
    
    // Try to load the first available data file
    vector<string> files = visualizer.getDataFiles();
    if (!files.empty()) {
        visualizer.readDataFromFile(files[0]);
    }
    
    visualizer.showMenu();
    return 0;
} 