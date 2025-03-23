const mvcPattern = {
  id: 'mvc',
  name: 'MVC (Model-View-Controller)',
  category: 'architectural',
  description: 'Separa una aplicación en tres componentes principales: Modelo (datos y lógica de negocio), Vista (interfaz de usuario) y Controlador (gestiona la entrada y coordina modelo y vista).',
  
  theory: {
    background: 'El patrón MVC fue descrito por primera vez en 1979 por Trygve Reenskaug mientras trabajaba en Smalltalk en Xerox PARC. Ha evolucionado para convertirse en uno de los patrones arquitectónicos más utilizados para interfaces de usuario.',
    problem: 'La mezcla de lógica de presentación, lógica de negocio y manipulación de datos crea código difícil de mantener, probar y reutilizar.',
    solution: 'Dividir la aplicación en tres componentes interconectados pero con responsabilidades claramente definidas: el Modelo gestiona los datos, la Vista presenta la información al usuario y el Controlador maneja la entrada del usuario.',
    applicability: [
      "Aplicaciones con interfaces de usuario complejas",
      "Sistemas donde la lógica de presentación y la lógica de negocio deben estar claramente separadas",
      "Aplicaciones que se benefician de múltiples vistas para los mismos datos",
      "Interfaces de usuario que pueden cambiar con frecuencia de forma independiente de la lógica de negocio"
    ],
    consequences: [
      "Mayor modularidad y separación de responsabilidades",
      "Facilita el desarrollo en paralelo por diferentes equipos",
      "Mejora la capacidad de prueba de cada componente por separado",
      "Mayor reutilización de código, especialmente del modelo",
      "Mayor complejidad inicial en comparación con un enfoque monolítico",
      "Puede llevar a un exceso de comunicación entre componentes si no se implementa correctamente"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

// MODELO
class StudentModel {
private:
    std::vector<std::string> students;
    
public:
    void addStudent(const std::string& name) {
        students.push_back(name);
    }
    
    bool removeStudent(const std::string& name) {
        auto it = std::find(students.begin(), students.end(), name);
        if (it != students.end()) {
            students.erase(it);
            return true;
        }
        return false;
    }
    
    std::vector<std::string> getAllStudents() const {
        return students;
    }
    
    bool contains(const std::string& name) const {
        return std::find(students.begin(), students.end(), name) != students.end();
    }
};

// VISTA
class StudentView {
public:
    void printStudentDetails(const std::vector<std::string>& students) {
        std::cout << "Lista de estudiantes:" << std::endl;
        
        if (students.empty()) {
            std::cout << "No hay estudiantes registrados." << std::endl;
            return;
        }
        
        for (size_t i = 0; i < students.size(); ++i) {
            std::cout << (i + 1) << ". " << students[i] << std::endl;
        }
    }
    
    void printError(const std::string& message) {
        std::cout << "Error: " << message << std::endl;
    }
    
    void printSuccess(const std::string& message) {
        std::cout << "Éxito: " << message << std::endl;
    }
};

// CONTROLADOR
class StudentController {
private:
    StudentModel model;
    StudentView view;
    
public:
    void addStudent(const std::string& name) {
        if (name.empty()) {
            view.printError("El nombre del estudiante no puede estar vacío");
            return;
        }
        
        if (model.contains(name)) {
            view.printError("El estudiante '" + name + "' ya existe");
            return;
        }
        
        model.addStudent(name);
        view.printSuccess("Estudiante '" + name + "' añadido correctamente");
        showAllStudents();
    }
    
    void removeStudent(const std::string& name) {
        if (name.empty()) {
            view.printError("El nombre del estudiante no puede estar vacío");
            return;
        }
        
        if (model.removeStudent(name)) {
            view.printSuccess("Estudiante '" + name + "' eliminado correctamente");
        } else {
            view.printError("No se pudo encontrar al estudiante '" + name + "'");
        }
        
        showAllStudents();
    }
    
    void showAllStudents() {
        view.printStudentDetails(model.getAllStudents());
    }
};

// Cliente
int main() {
    StudentController controller;
    
    // Interacción simulada con el usuario
    controller.addStudent("Ana García");
    controller.addStudent("Juan Pérez");
    controller.addStudent("María López");
    
    // Intentar añadir un estudiante duplicado
    controller.addStudent("Ana García");
    
    // Eliminar un estudiante
    controller.removeStudent("Juan Pérez");
    
    // Intentar eliminar un estudiante que no existe
    controller.removeStudent("Carlos Ruiz");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras necesarias para el ejemplo.' },
        { line: 6, text: 'Definimos el MODELO, que contiene los datos y la lógica de negocio.' },
        { line: 7, text: 'Los datos son privados para garantizar la encapsulación.' },
        { line: 8, text: 'Utilizamos un vector para almacenar los nombres de los estudiantes.' },
        { line: 11, text: 'Método para añadir un estudiante al modelo.' },
        { line: 15, text: 'Método para eliminar un estudiante por nombre.' },
        { line: 16, text: 'Buscamos el estudiante en el vector.' },
        { line: 17, text: 'Si lo encontramos, lo eliminamos y devolvemos true.' },
        { line: 24, text: 'Método para obtener todos los estudiantes.' },
        { line: 28, text: 'Método para verificar si un estudiante ya existe.' },
        { line: 33, text: 'Definimos la VISTA, responsable de la presentación al usuario.' },
        { line: 35, text: 'Método para mostrar la lista de estudiantes.' },
        { line: 38, text: 'Comprobamos si la lista está vacía para mostrar un mensaje adecuado.' },
        { line: 44, text: 'Método para mostrar mensajes de error.' },
        { line: 48, text: 'Método para mostrar mensajes de éxito.' },
        { line: 53, text: 'Definimos el CONTROLADOR, que coordina el modelo y la vista.' },
        { line: 54, text: 'El controlador tiene instancias del modelo y la vista.' },
        { line: 58, text: 'Método para añadir un estudiante con validaciones.' },
        { line: 59, text: 'Validamos que el nombre no esté vacío.' },
        { line: 64, text: 'Validamos que el estudiante no exista ya.' },
        { line: 69, text: 'Si pasa las validaciones, añadimos el estudiante al modelo.' },
        { line: 70, text: 'Mostramos un mensaje de éxito a través de la vista.' },
        { line: 71, text: 'Actualizamos la vista para mostrar todos los estudiantes.' },
        { line: 75, text: 'Método para eliminar un estudiante con validaciones similares.' },
        { line: 87, text: 'Método para mostrar todos los estudiantes.' },
        { line: 92, text: 'Cliente que demuestra el uso del patrón MVC.' },
        { line: 96, text: 'Simulamos interacciones del usuario a través del controlador.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <memory>
#include <functional>
#include <optional>

// MODELO - Contiene los datos y la lógica de negocio
class StudentModel {
private:
    std::vector<std::string> students;
    
    // Observadores para notificar cambios
    std::vector<std::function<void()>> observers;
    
public:
    void addObserver(std::function<void()> observer) {
        observers.push_back(std::move(observer));
    }
    
    void notifyObservers() const {
        for (const auto& observer : observers) {
            observer();
        }
    }
    
    void addStudent(std::string name) {
        students.push_back(std::move(name));
        notifyObservers();
    }
    
    bool removeStudent(const std::string& name) {
        auto it = std::find(students.begin(), students.end(), name);
        if (it != students.end()) {
            students.erase(it);
            notifyObservers();
            return true;
        }
        return false;
    }
    
    const std::vector<std::string>& getAllStudents() const {
        return students;
    }
    
    bool contains(const std::string& name) const {
        return std::find(students.begin(), students.end(), name) != students.end();
    }
};

// VISTA - Maneja la presentación
class StudentView {
public:
    void printStudentDetails(const std::vector<std::string>& students) const {
        std::cout << "Lista de estudiantes:" << std::endl;
        
        if (students.empty()) {
            std::cout << "No hay estudiantes registrados." << std::endl;
            return;
        }
        
        for (size_t i = 0; i < students.size(); ++i) {
            std::cout << (i + 1) << ". " << students[i] << std::endl;
        }
        std::cout << std::endl;
    }
    
    void printMessage(const std::string& message, bool isError = false) const {
        std::cout << (isError ? "Error: " : "Éxito: ") << message << std::endl;
    }
    
    std::optional<std::string> getStudentNameFromInput() const {
        std::cout << "Ingrese el nombre del estudiante (o 'salir' para terminar): ";
        std::string name;
        std::getline(std::cin, name);
        
        if (name == "salir") {
            return std::nullopt;
        }
        
        return name;
    }
};

// CONTROLADOR - Coordina el modelo y la vista
class StudentController {
private:
    std::shared_ptr<StudentModel> model;
    std::shared_ptr<StudentView> view;
    
public:
    StudentController(std::shared_ptr<StudentModel> model, std::shared_ptr<StudentView> view)
        : model(std::move(model)), view(std::move(view)) {
        // Configuramos un observador para actualizar la vista cuando cambia el modelo
        this->model->addObserver([this]() {
            this->updateView();
        });
    }
    
    void addStudent(const std::string& name) {
        if (name.empty()) {
            view->printMessage("El nombre del estudiante no puede estar vacío", true);
            return;
        }
        
        if (model->contains(name)) {
            view->printMessage("El estudiante '" + name + "' ya existe", true);
            return;
        }
        
        model->addStudent(name);
        view->printMessage("Estudiante '" + name + "' añadido correctamente");
    }
    
    void removeStudent(const std::string& name) {
        if (name.empty()) {
            view->printMessage("El nombre del estudiante no puede estar vacío", true);
            return;
        }
        
        if (model->removeStudent(name)) {
            view->printMessage("Estudiante '" + name + "' eliminado correctamente");
        } else {
            view->printMessage("No se pudo encontrar al estudiante '" + name + "'", true);
        }
    }
    
    void updateView() {
        view->printStudentDetails(model->getAllStudents());
    }
    
    void run() {
        updateView();
        
        while (true) {
            auto optionalName = view->getStudentNameFromInput();
            if (!optionalName) {
                break;
            }
            
            std::cout << "¿Qué acción desea realizar? (1: Añadir, 2: Eliminar): ";
            int choice;
            std::cin >> choice;
            std::cin.ignore(); // Limpiar el buffer
            
            switch (choice) {
                case 1:
                    addStudent(*optionalName);
                    break;
                case 2:
                    removeStudent(*optionalName);
                    break;
                default:
                    view->printMessage("Opción no válida", true);
            }
        }
    }
};

// Cliente
int main() {
    // Creamos los componentes usando smart pointers
    auto model = std::make_shared<StudentModel>();
    auto view = std::make_shared<StudentView>();
    
    // Creamos el controlador y le pasamos el modelo y la vista
    StudentController controller(model, view);
    
    // Añadimos algunos estudiantes para tener datos iniciales
    controller.addStudent("Ana García");
    controller.addStudent("Juan Pérez");
    controller.addStudent("María López");
    
    // Ejecutamos la aplicación interactiva
    // controller.run(); // Descomentar para uso interactivo
    
    // O simulamos algunas acciones
    controller.updateView();
    controller.removeStudent("Juan Pérez");
    controller.addStudent("Carlos Ruiz");
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos cabeceras adicionales para características de C++ moderno.' },
        { line: 9, text: 'El MODELO contiene datos y la lógica de negocio.' },
        { line: 12, text: 'Añadimos un sistema de observadores para notificar cambios en el modelo.' },
        { line: 15, text: 'Método para registrar observadores que se notificarán cuando haya cambios.' },
        { line: 19, text: 'Método para notificar a todos los observadores.' },
        { line: 25, text: 'Usamos std::move para transferir la propiedad de las cadenas, optimizando el rendimiento.' },
        { line: 26, text: 'Notificamos a los observadores tras añadir un estudiante.' },
        { line: 34, text: 'También notificamos después de eliminar un estudiante.' },
        { line: 39, text: 'Devolvemos una referencia constante para evitar copias innecesarias.' },
        { line: 47, text: 'La VISTA maneja la presentación de datos al usuario.' },
        { line: 49, text: 'Método para mostrar estudiantes, marcado como const porque no modifica el estado de la vista.' },
        { line: 61, text: 'Método unificado para mostrar mensajes, con un parámetro para distinguir errores.' },
        { line: 65, text: 'Utilizamos std::optional para representar la posibilidad de que no haya entrada.' },
        { line: 76, text: 'El CONTROLADOR coordina el modelo y la vista, usando smart pointers para gestión automática de memoria.' },
        { line: 81, text: 'Constructor que toma smart pointers al modelo y la vista, usando std::move para transferir la propiedad.' },
        { line: 83, text: 'Configuramos un observador utilizando una lambda para actualizar la vista cuando cambia el modelo.' },
        { line: 88, text: 'Método para añadir un estudiante con validaciones.' },
        { line: 102, text: 'Método para eliminar un estudiante.' },
        { line: 114, text: 'Método para actualizar la vista con los datos actuales del modelo.' },
        { line: 118, text: 'Método run para ejecutar una interfaz interactiva con el usuario.' },
        { line: 145, text: 'Cliente que demuestra el uso del patrón MVC con C++ moderno.' },
        { line: 147, text: 'Utilizamos std::make_shared para crear instancias con gestión automática de memoria.' }
      ]
    },
    java: {
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Consumer;

// MODELO - Contiene los datos y la lógica de negocio
class StudentModel {
    private List<String> students = new ArrayList<>();
    private List<Runnable> observers = new ArrayList<>();
    
    public void addObserver(Runnable observer) {
        observers.add(observer);
    }
    
    private void notifyObservers() {
        for (Runnable observer : observers) {
            observer.run();
        }
    }
    
    public void addStudent(String name) {
        students.add(name);
        notifyObservers();
    }
    
    public boolean removeStudent(String name) {
        boolean result = students.remove(name);
        if (result) {
            notifyObservers();
        }
        return result;
    }
    
    public List<String> getAllStudents() {
        return new ArrayList<>(students); // Devolvemos una copia para mantener la encapsulación
    }
    
    public boolean contains(String name) {
        return students.contains(name);
    }
}

// VISTA - Maneja la presentación
class StudentView {
    private Scanner scanner = new Scanner(System.in);
    
    public void printStudentDetails(List<String> students) {
        System.out.println("Lista de estudiantes:");
        
        if (students.isEmpty()) {
            System.out.println("No hay estudiantes registrados.");
            return;
        }
        
        for (int i = 0; i < students.size(); i++) {
            System.out.println((i + 1) + ". " + students.get(i));
        }
        System.out.println();
    }
    
    public void printMessage(String message, boolean isError) {
        System.out.println((isError ? "Error: " : "Éxito: ") + message);
    }
    
    public String getStudentNameFromInput() {
        System.out.print("Ingrese el nombre del estudiante (o 'salir' para terminar): ");
        return scanner.nextLine();
    }
    
    public int getActionChoice() {
        System.out.print("¿Qué acción desea realizar? (1: Añadir, 2: Eliminar): ");
        try {
            int choice = Integer.parseInt(scanner.nextLine());
            return choice;
        } catch (NumberFormatException e) {
            return -1;
        }
    }
    
    public void close() {
        scanner.close();
    }
}

// CONTROLADOR - Coordina el modelo y la vista
class StudentController {
    private StudentModel model;
    private StudentView view;
    
    public StudentController(StudentModel model, StudentView view) {
        this.model = model;
        this.view = view;
        
        // Configuramos un observador para actualizar la vista cuando cambia el modelo
        this.model.addObserver(() -> this.updateView());
    }
    
    public void addStudent(String name) {
        if (name == null || name.trim().isEmpty()) {
            view.printMessage("El nombre del estudiante no puede estar vacío", true);
            return;
        }
        
        if (model.contains(name)) {
            view.printMessage("El estudiante '" + name + "' ya existe", true);
            return;
        }
        
        model.addStudent(name);
        view.printMessage("Estudiante '" + name + "' añadido correctamente", false);
    }
    
    public void removeStudent(String name) {
        if (name == null || name.trim().isEmpty()) {
            view.printMessage("El nombre del estudiante no puede estar vacío", true);
            return;
        }
        
        if (model.removeStudent(name)) {
            view.printMessage("Estudiante '" + name + "' eliminado correctamente", false);
        } else {
            view.printMessage("No se pudo encontrar al estudiante '" + name + "'", true);
        }
    }
    
    public void updateView() {
        view.printStudentDetails(model.getAllStudents());
    }
    
    public void run() {
        updateView();
        
        while (true) {
            String name = view.getStudentNameFromInput();
            if ("salir".equalsIgnoreCase(name)) {
                break;
            }
            
            int choice = view.getActionChoice();
            
            switch (choice) {
                case 1:
                    addStudent(name);
                    break;
                case 2:
                    removeStudent(name);
                    break;
                default:
                    view.printMessage("Opción no válida", true);
            }
        }
        
        view.close();
    }
}

// Cliente principal
public class MVCDemo {
    public static void main(String[] args) {
        // Creamos los componentes
        StudentModel model = new StudentModel();
        StudentView view = new StudentView();
        
        // Creamos el controlador y le pasamos el modelo y la vista
        StudentController controller = new StudentController(model, view);
        
        // Añadimos algunos estudiantes para tener datos iniciales
        controller.addStudent("Ana García");
        controller.addStudent("Juan Pérez");
        controller.addStudent("María López");
        
        // Podemos ejecutar la aplicación interactiva
        // controller.run();
        
        // O simular algunas acciones
        controller.updateView();
        controller.removeStudent("Juan Pérez");
        controller.addStudent("Carlos Ruiz");
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para el ejemplo.' },
        { line: 6, text: 'El MODELO contiene los datos y la lógica de negocio.' },
        { line: 7, text: 'Utilizamos ArrayList para almacenar los estudiantes.' },
        { line: 8, text: 'Implementamos un sistema de observadores para notificar cambios.' },
        { line: 10, text: 'Método para registrar observadores.' },
        { line: 14, text: 'Método para notificar a todos los observadores cuando hay cambios.' },
        { line: 19, text: 'Añadimos un estudiante y notificamos a los observadores.' },
        { line: 24, text: 'Eliminamos un estudiante y notificamos solo si se eliminó correctamente.' },
        { line: 31, text: 'Devolvemos una copia de la lista para mantener la encapsulación.' },
        { line: 37, text: 'La VISTA maneja la presentación al usuario.' },
        { line: 38, text: 'Utilizamos Scanner para leer la entrada del usuario.' },
        { line: 53, text: 'Método unificado para mostrar mensajes.' },
        { line: 57, text: 'Método para obtener el nombre de un estudiante desde la entrada del usuario.' },
        { line: 62, text: 'Método para obtener la elección de acción del usuario.' },
        { line: 72, text: 'Método para cerrar el scanner, importante para evitar fugas de recursos.' },
        { line: 77, text: 'El CONTROLADOR coordina el modelo y la vista.' },
        { line: 83, text: 'Configuramos un observador usando una expresión lambda.' },
        { line: 87, text: 'Método para añadir un estudiante con validaciones.' },
        { line: 88, text: 'Validamos que el nombre no sea nulo ni esté vacío después de eliminar espacios.' },
        { line: 102, text: 'Método para eliminar un estudiante.' },
        { line: 114, text: 'Método para actualizar la vista con los datos actuales.' },
        { line: 118, text: 'Método run para la ejecución interactiva.' },
        { line: 144, text: 'Clase principal con método main.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Comunicación entre componentes',
      cppTraditional: 'Comunicación directa desde el controlador al modelo y a la vista, sin notificaciones automáticas cuando cambia el estado.',
      cppModern: 'Utiliza el patrón Observer con std::function y lambdas para notificar automáticamente a la vista cuando cambia el modelo.',
      java: 'Implementa el patrón Observer con interfaces funcionales (Runnable) y expresiones lambda para actualizaciones automáticas.'
    },
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Instancias creadas en la pila, sin gestión dinámica de memoria en este ejemplo.',
      cppModern: 'Uso de smart pointers (shared_ptr) para la gestión automática de memoria y ownership compartido.',
      java: 'Gestión automática de memoria a través del recolector de basura de Java.'
    },
    {
      title: 'Manejo de datos opcionales',
      cppTraditional: 'Usa valores de retorno booleanos para indicar éxito/fracaso en las operaciones.',
      cppModern: 'Utiliza std::optional para representar valores que pueden estar ausentes.',
      java: 'Utiliza valores de retorno null o manejo de excepciones para casos especiales.'
    },
    {
      title: 'Interacción con el usuario',
      cppTraditional: 'Interacción simulada sin entrada real del usuario.',
      cppModern: 'Incluye un método run() con un bucle interactivo que permite interacción real con el usuario.',
      java: 'Proporciona una interfaz de usuario interactiva completa con manejo adecuado de entrada/salida.'
    }
  ],
  
  notes: 'El patrón MVC es fundamental en el desarrollo de aplicaciones con interfaces de usuario. Aunque originalmente se diseñó para aplicaciones de escritorio, ha evolucionado y se ha adaptado para aplicaciones web y móviles. Existen muchas variantes como MVP (Model-View-Presenter) y MVVM (Model-View-ViewModel) que abordan limitaciones específicas del MVC clásico. En aplicaciones web modernas, frameworks como Angular, React o Vue implementan versiones adaptadas de estos patrones. La clave del éxito con MVC es mantener una separación clara de responsabilidades: el modelo nunca debe conocer la vista, y la vista idealmente no debería conocer detalles del modelo más allá de los necesarios para mostrar la información.'
};

export default mvcPattern; 