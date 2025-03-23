const mementoPattern = {
  id: 'memento',
  name: 'Memento',
  category: 'behavioral',
  description: 'El patrón Memento permite capturar y externalizar el estado interno de un objeto sin violar la encapsulación, de manera que el objeto pueda restaurarse a este estado más adelante.',
  
  theory: {
    background: 'En muchas aplicaciones, necesitamos capturar el estado de un objeto para poder revertir cambios o implementar funcionalidades de "deshacer".',
    problem: 'Necesitamos guardar el estado interno de un objeto para restaurarlo posteriormente, pero no queremos exponer su implementación interna, rompiendo la encapsulación.',
    solution: 'El patrón Memento crea un objeto memento que contiene una instantánea del estado interno del objeto originator, sin exponer sus detalles internos.',
    applicability: [
      'Cuando necesitas guardar el estado de un objeto para restaurarlo posteriormente (como en funcionalidades de deshacer)',
      'Cuando la obtención directa del estado expondría los detalles internos, rompiendo la encapsulación',
      'Cuando deseas implementar puntos de control (checkpoints) que permitan volver a un estado anterior'
    ],
    consequences: [
      'Preserva la encapsulación del objeto originador',
      'Simplifica el código del originador al delegar el almacenamiento del estado a otro objeto',
      'Puede consumir mucha memoria si los mementos almacenan grandes cantidades de datos o se crean frecuentemente',
      'Requiere coordinación con el mecanismo de gestión de vida del memento para evitar fugas de memoria'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <ctime>

// Clase Memento - Almacena el estado interno del Originador
class Memento {
private:
    std::string state;
    std::string timestamp;
    
    // El constructor es privado, solo accesible por Originator
    Memento(const std::string& state) : state(state) {
        time_t now = time(0);
        timestamp = ctime(&now);
    }
    
    // Originator es una clase amiga, lo que le permite acceder a miembros privados
    friend class Originator;
    
public:
    std::string getTimestamp() const {
        return timestamp;
    }
};

// Clase Originator - Cuyo estado queremos guardar y restaurar
class Originator {
private:
    std::string state;
    
public:
    Originator(const std::string& state) : state(state) {
        std::cout << "Originator: Estado inicial: " << state << std::endl;
    }
    
    void setState(const std::string& newState) {
        std::cout << "Originator: Cambiando estado a: " << newState << std::endl;
        state = newState;
    }
    
    // Crear un memento con el estado actual
    Memento* save() {
        std::cout << "Originator: Guardando en Memento." << std::endl;
        return new Memento(state);
    }
    
    // Restaurar el estado desde un memento
    void restore(Memento* memento) {
        state = memento->state;
        std::cout << "Originator: Estado restaurado a: " << state << std::endl;
    }
    
    void showState() const {
        std::cout << "Originator: Estado actual: " << state << std::endl;
    }
};

// Clase Caretaker - Gestiona y guarda los mementos sin modificar su contenido
class Caretaker {
private:
    std::vector<Memento*> mementos;
    Originator* originator;
    
public:
    Caretaker(Originator* originator) : originator(originator) {}
    
    ~Caretaker() {
        // Limpiar mementos en el destructor
        for (auto m : mementos) {
            delete m;
        }
    }
    
    // Realiza un backup del estado actual del originator
    void backup() {
        std::cout << "\nCaretaker: Realizando backup..." << std::endl;
        mementos.push_back(originator->save());
    }
    
    // Deshace el último cambio restaurando el último estado guardado
    void undo() {
        if (mementos.empty()) {
            std::cout << "Caretaker: No hay estados para restaurar." << std::endl;
            return;
        }
        
        Memento* memento = mementos.back();
        mementos.pop_back();
        
        std::cout << "Caretaker: Restaurando al estado del " << memento->getTimestamp();
        originator->restore(memento);
        
        delete memento;
    }
    
    // Muestra la historia de estados guardados
    void showHistory() const {
        std::cout << "Caretaker: Lista de Mementos:" << std::endl;
        if (mementos.empty()) {
            std::cout << "  No hay Mementos guardados." << std::endl;
            return;
        }
        
        for (size_t i = 0; i < mementos.size(); i++) {
            std::cout << i + 1 << ": " << mementos[i]->getTimestamp();
        }
    }
};

// Demostración del patrón Memento
int main() {
    // Crear el originador con un estado inicial
    Originator* originator = new Originator("Estado inicial");
    
    // Crear el caretaker que gestionará los mementos
    Caretaker* caretaker = new Caretaker(originator);
    
    // Realizar cambios y backups
    caretaker->backup();  // Guardar el estado inicial
    
    originator->setState("Estado 1");
    caretaker->backup();  // Guardar estado 1
    
    originator->setState("Estado 2");
    caretaker->backup();  // Guardar estado 2
    
    originator->setState("Estado 3");
    
    // Mostrar el estado actual y la historia
    originator->showState();
    caretaker->showHistory();
    
    // Deshacer los cambios para volver a estados anteriores
    std::cout << "\nDeshaciendo cambios:" << std::endl;
    caretaker->undo();
    originator->showState();
    
    caretaker->undo();
    originator->showState();
    
    caretaker->undo();
    originator->showState();
    
    // Limpiar memoria
    delete caretaker;
    delete originator;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias.' },
        { line: 6, text: 'La clase Memento encapsula el estado que queremos guardar.' },
        { line: 8, text: 'El estado y la marca de tiempo son privados para proteger la encapsulación.' },
        { line: 12, text: 'El constructor es privado para que solo Originator pueda crear mementos.' },
        { line: 13, text: 'Guardamos el estado y capturamos una marca de tiempo para identificar cada memento.' },
        { line: 18, text: 'Declaramos Originator como clase amiga para que pueda acceder a los miembros privados de Memento.' },
        { line: 21, text: 'Proporcionamos un método público para obtener la marca de tiempo, útil para el Caretaker.' },
        { line: 27, text: 'La clase Originator representa el objeto cuyo estado queremos guardar y restaurar.' },
        { line: 29, text: 'El estado interno que será guardado en los mementos.' },
        { line: 36, text: 'El método setState cambia el estado interno del Originator.' },
        { line: 42, text: 'El método save crea un nuevo Memento con el estado actual y lo devuelve.' },
        { line: 48, text: 'El método restore recupera el estado desde un Memento.' },
        { line: 53, text: 'Método auxiliar para mostrar el estado actual.' },
        { line: 58, text: 'La clase Caretaker gestiona los mementos sin modificar su contenido.' },
        { line: 60, text: 'Almacena los mementos en un vector y mantiene una referencia al Originator.' },
        { line: 65, text: 'En el destructor, eliminamos todos los mementos para evitar fugas de memoria.' },
        { line: 73, text: 'El método backup guarda el estado actual del Originator creando un nuevo Memento.' },
        { line: 79, text: 'El método undo restaura el estado anterior deshaciendo el último cambio.' },
        { line: 85, text: 'Obtenemos el último memento y lo eliminamos de la lista.' },
        { line: 88, text: 'Restauramos el estado del Originator con el memento recuperado.' },
        { line: 90, text: 'Eliminamos el memento después de usarlo para evitar fugas de memoria.' },
        { line: 94, text: 'El método showHistory muestra la lista de mementos guardados.' },
        { line: 107, text: 'Demostramos el patrón Memento creando un Originator y un Caretaker.' },
        { line: 117, text: 'Realizamos cambios en el estado del Originator y guardamos mementos después de cada cambio.' },
        { line: 130, text: 'Deshacemos los cambios consecutivamente, volviendo a estados anteriores.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <iomanip>
#include <memory>
#include <functional>
#include <sstream>

// Clase Memento moderna con Smart Pointers
class Memento {
private:
    std::string state;
    std::string timestamp;
    
    // Constructor privado accesible solo por la clase Originator
    Memento(std::string state) : state(std::move(state)) {
        // Generar timestamp formateado usando C++11
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&time), "%Y-%m-%d %X");
        timestamp = ss.str();
    }
    
    friend class Originator;  // Originator puede acceder a los miembros privados
    
public:
    std::string getTimestamp() const {
        return timestamp;
    }
};

// Clase Originator moderna
class Originator {
private:
    std::string state;
    
public:
    explicit Originator(std::string state) : state(std::move(state)) {
        std::cout << "Originator: Estado inicial: " << this->state << std::endl;
    }
    
    void setState(std::string newState) {
        std::cout << "Originator: Cambiando estado a: " << newState << std::endl;
        state = std::move(newState);
    }
    
    // Crear un memento con el estado actual (usando std::make_unique)
    std::unique_ptr<Memento> save() {
        std::cout << "Originator: Guardando en Memento." << std::endl;
        return std::make_unique<Memento>(state);
    }
    
    // Restaurar el estado desde un memento
    void restore(const Memento& memento) {
        state = memento.state;  // Accedemos directamente al estado privado como amigos
        std::cout << "Originator: Estado restaurado a: " << state << std::endl;
    }
    
    void showState() const {
        std::cout << "Originator: Estado actual: " << state << std::endl;
    }
};

// Command para capturar operaciones con funcionalidad de deshacer
class Command {
public:
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
};

// Comando concreto que cambia el estado del Originator
class ChangeStateCommand : public Command {
private:
    Originator& originator;
    std::string newState;
    std::unique_ptr<Memento> backup;
    
public:
    ChangeStateCommand(Originator& originator, std::string newState)
        : originator(originator), newState(std::move(newState)) {}
    
    void execute() override {
        // Guardar el estado actual antes de cambiarlo
        backup = originator.save();
        originator.setState(newState);
    }
    
    void undo() override {
        if (backup) {
            originator.restore(*backup);
        }
    }
};

// Clase CommandManager que gestiona los comandos y mementos
class CommandManager {
private:
    std::vector<std::unique_ptr<Command>> history;
    
public:
    void executeCommand(std::unique_ptr<Command> command) {
        std::cout << "\nCommandManager: Ejecutando comando" << std::endl;
        command->execute();
        history.push_back(std::move(command));
    }
    
    void undo() {
        if (history.empty()) {
            std::cout << "CommandManager: No hay comandos para deshacer" << std::endl;
            return;
        }
        
        std::cout << "CommandManager: Deshaciendo comando" << std::endl;
        history.back()->undo();
        history.pop_back();
    }
};

// Demostración del patrón Memento con C++ moderno
int main() {
    // Crear el originador
    Originator originator("Estado inicial");
    
    // Crear el gestor de comandos
    CommandManager manager;
    
    // Ejecutar comandos que cambian el estado
    manager.executeCommand(std::make_unique<ChangeStateCommand>(originator, "Estado 1"));
    originator.showState();
    
    manager.executeCommand(std::make_unique<ChangeStateCommand>(originator, "Estado 2"));
    originator.showState();
    
    manager.executeCommand(std::make_unique<ChangeStateCommand>(originator, "Estado 3"));
    originator.showState();
    
    // Deshacer cambios
    std::cout << "\nDeshaciendo cambios:" << std::endl;
    manager.undo();
    originator.showState();
    
    manager.undo();
    originator.showState();
    
    manager.undo();
    originator.showState();
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos bibliotecas adicionales para trabajar con tiempo, flujos y memoria inteligente en C++ moderno.' },
        { line: 10, text: 'Clase Memento similar a la versión tradicional, pero preparada para trabajar con smart pointers.' },
        { line: 15, text: 'Usamos std::move para transferir la propiedad de la cadena sin copias innecesarias.' },
        { line: 17, text: 'Usamos la biblioteca chrono de C++11 para generar timestamps con formato.' },
        { line: 20, text: 'Formateamos la fecha usando std::put_time, disponible en C++11.' },
        { line: 32, text: 'La clase Originator es similar a la versión tradicional, pero usa C++ moderno.' },
        { line: 36, text: 'Usamos el calificador explicit para prevenir conversiones implícitas en el constructor.' },
        { line: 45, text: 'Ahora save() devuelve un std::unique_ptr<Memento> para gestión automática de memoria.' },
        { line: 46, text: 'Usamos std::make_unique (C++14) para crear el memento sin usar new explícitamente.' },
        { line: 51, text: 'Restauramos pasando el memento por referencia constante, evitando copias innecesarias.' },
        { line: 60, text: 'Implementamos una capa adicional con el patrón Command para manejar operaciones y deshacer.' },
        { line: 67, text: 'ChangeStateCommand combina Command y Memento para cambiar el estado y poder deshacerlo.' },
        { line: 70, text: 'Almacenamos una referencia al Originator y el nuevo estado que aplicaremos.' },
        { line: 71, text: 'backup es un std::unique_ptr que almacenará el memento para la operación de deshacer.' },
        { line: 77, text: 'Al ejecutar, primero guardamos el estado actual y luego lo cambiamos.' },
        { line: 83, text: 'Al deshacer, restauramos el estado anterior usando el memento guardado.' },
        { line: 90, text: 'CommandManager gestiona una lista de comandos y proporciona funcionalidad para ejecutar y deshacer.' },
        { line: 92, text: 'Usamos un vector de std::unique_ptr<Command> para almacenar los comandos ejecutados.' },
        { line: 96, text: 'executeCommand toma posesión del comando y lo ejecuta, añadiéndolo al historial.' },
        { line: 102, text: 'undo deshace el último comando ejecutado y lo elimina del historial.' },
        { line: 118, text: 'Creamos un Originator y un CommandManager para demostrar el patrón.' },
        { line: 122, text: 'Ejecutamos comandos que cambian el estado del Originator.' },
        { line: 123, text: 'Usamos std::make_unique para crear comandos sin gestión manual de memoria.' },
        { line: 132, text: 'Deshacemos los comandos secuencialmente, restaurando estados anteriores.' }
      ]
    },
    java: {
      code: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

// Clase Memento - Almacena el estado interno del Originador
class Memento {
    private final String state;
    private final String timestamp;
    
    // Constructor con acceso de paquete para que solo Originator pueda crear mementos
    Memento(String state) {
        this.state = state;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    
    // Método de acceso protegido para Originator
    String getState() {
        return state;
    }
    
    // Método público para el Caretaker
    public String getTimestamp() {
        return timestamp;
    }
}

// Clase Originator - Cuyo estado queremos guardar y restaurar
class Originator {
    private String state;
    
    public Originator(String state) {
        this.state = state;
        System.out.println("Originator: Estado inicial: " + state);
    }
    
    public void setState(String state) {
        System.out.println("Originator: Cambiando estado a: " + state);
        this.state = state;
    }
    
    // Crear un memento con el estado actual
    public Memento save() {
        System.out.println("Originator: Guardando en Memento.");
        return new Memento(state);
    }
    
    // Restaurar el estado desde un memento
    public void restore(Memento memento) {
        state = memento.getState();
        System.out.println("Originator: Estado restaurado a: " + state);
    }
    
    public void showState() {
        System.out.println("Originator: Estado actual: " + state);
    }
}

// Clase Caretaker - Gestiona y guarda los mementos sin modificar su contenido
class Caretaker {
    private final List<Memento> mementos = new ArrayList<>();
    private final Originator originator;
    
    public Caretaker(Originator originator) {
        this.originator = originator;
    }
    
    // Realiza un backup del estado actual del originator
    public void backup() {
        System.out.println("\nCaretaker: Realizando backup...");
        mementos.add(originator.save());
    }
    
    // Deshace el último cambio restaurando el último estado guardado
    public void undo() {
        if (mementos.isEmpty()) {
            System.out.println("Caretaker: No hay estados para restaurar.");
            return;
        }
        
        Memento memento = mementos.remove(mementos.size() - 1);
        System.out.println("Caretaker: Restaurando al estado del " + memento.getTimestamp());
        originator.restore(memento);
    }
    
    // Muestra la historia de estados guardados
    public void showHistory() {
        System.out.println("Caretaker: Lista de Mementos:");
        if (mementos.isEmpty()) {
            System.out.println("  No hay Mementos guardados.");
            return;
        }
        
        for (int i = 0; i < mementos.size(); i++) {
            System.out.println((i + 1) + ": " + mementos.get(i).getTimestamp());
        }
    }
}

// Comando para implementar deshacer con memento
interface Command {
    void execute();
    void undo();
}

// Comando concreto que cambia el estado
class ChangeStateCommand implements Command {
    private final Originator originator;
    private final String newState;
    private Memento backup;
    
    public ChangeStateCommand(Originator originator, String newState) {
        this.originator = originator;
        this.newState = newState;
    }
    
    @Override
    public void execute() {
        // Guardar estado antes de cambiarlo
        backup = originator.save();
        originator.setState(newState);
    }
    
    @Override
    public void undo() {
        if (backup != null) {
            originator.restore(backup);
        }
    }
}

// Ejemplo de uso del patrón Memento
public class MementoDemo {
    public static void main(String[] args) {
        // Ejemplo 1: Usando Caretaker tradicional
        System.out.println("EJEMPLO USANDO CARETAKER TRADICIONAL:");
        
        Originator originator = new Originator("Estado inicial");
        Caretaker caretaker = new Caretaker(originator);
        
        // Realizar cambios y backups
        caretaker.backup();  // Guardar estado inicial
        
        originator.setState("Estado 1");
        caretaker.backup();  // Guardar estado 1
        
        originator.setState("Estado 2");
        caretaker.backup();  // Guardar estado 2
        
        originator.setState("Estado 3");
        
        // Mostrar estado actual e historia
        originator.showState();
        caretaker.showHistory();
        
        // Deshacer cambios
        System.out.println("\nDeshaciendo cambios:");
        caretaker.undo();
        originator.showState();
        
        caretaker.undo();
        originator.showState();
        
        caretaker.undo();
        originator.showState();
        
        // Ejemplo 2: Usando Command con Memento
        System.out.println("\nEJEMPLO USANDO COMMAND CON MEMENTO:");
        
        Originator originator2 = new Originator("Estado inicial");
        List<Command> commands = new ArrayList<>();
        
        // Ejecutar comandos
        Command cmd1 = new ChangeStateCommand(originator2, "Estado 1");
        cmd1.execute();
        commands.add(cmd1);
        originator2.showState();
        
        Command cmd2 = new ChangeStateCommand(originator2, "Estado 2");
        cmd2.execute();
        commands.add(cmd2);
        originator2.showState();
        
        // Deshacer comandos
        System.out.println("\nDeshaciendo comandos:");
        for (int i = commands.size() - 1; i >= 0; i--) {
            commands.get(i).undo();
            originator2.showState();
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para trabajar con fechas y colecciones en Java.' },
        { line: 5, text: 'La clase Memento almacena el estado del Originator y una marca de tiempo.' },
        { line: 9, text: 'Constructor con visibilidad de paquete para que solo Originator pueda crear mementos.' },
        { line: 11, text: 'Usamos LocalDateTime de Java 8 para generar una marca de tiempo formateada.' },
        { line: 15, text: 'getState tiene acceso de paquete para que solo Originator pueda acceder al estado.' },
        { line: 20, text: 'getTimestamp es público para que Caretaker pueda mostrar información sin acceder al estado.' },
        { line: 25, text: 'La clase Originator representa el objeto cuyo estado queremos guardar y restaurar.' },
        { line: 39, text: 'El método save crea y devuelve un nuevo Memento con el estado actual.' },
        { line: 45, text: 'El método restore recupera el estado desde un Memento usando su método getState().' },
        { line: 54, text: 'La clase Caretaker gestiona los mementos sin modificar o acceder a su estado interno.' },
        { line: 56, text: 'Usamos ArrayList para almacenar los mementos y final para que la referencia no cambie.' },
        { line: 63, text: 'El método backup guarda el estado actual añadiendo un nuevo memento a la lista.' },
        { line: 69, text: 'El método undo restaura el estado anterior eliminando y utilizando el último memento.' },
        { line: 81, text: 'showHistory muestra la lista de mementos guardados por sus marcas de tiempo.' },
        { line: 94, text: 'Definimos una interfaz Command para implementar el patrón Command junto con Memento.' },
        { line: 100, text: 'ChangeStateCommand implementa Command para cambiar el estado y poder deshacerlo.' },
        { line: 111, text: 'Al ejecutar, guardamos el estado actual antes de cambiarlo, para poder deshacerlo después.' },
        { line: 123, text: 'En la demostración, mostramos dos enfoques: usando Caretaker y usando Command+Memento.' },
        { line: 127, text: 'En el primer ejemplo, usamos el enfoque tradicional con Caretaker.' },
        { line: 149, text: 'Deshacemos cambios en orden inverso usando el Caretaker.' },
        { line: 158, text: 'En el segundo ejemplo, combinamos los patrones Command y Memento.' },
        { line: 177, text: 'Para deshacer, recorremos la lista de comandos en orden inverso y llamamos a undo().' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Encapsulación',
      cppTraditional: 'Utiliza amistad de clases (friend) para permitir acceso al estado privado sin exponerlo públicamente.',
      cppModern: 'Mantiene la encapsulación con amistad de clases, pero añade gestión automática de memoria con smart pointers.',
      java: 'Usa visibilidad a nivel de paquete para controlar el acceso al estado del memento.'
    },
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria con new/delete, propenso a fugas de memoria.',
      cppModern: 'Usa std::unique_ptr para gestión automática de memoria, eliminando riesgos de fugas.',
      java: 'La gestión de memoria es automática gracias al recolector de basura de Java.'
    },
    {
      title: 'Integración con otros patrones',
      cppTraditional: 'Implementación más independiente, centrada solo en el patrón Memento.',
      cppModern: 'Se integra con el patrón Command para proporcionar funcionalidad de deshacer más completa.',
      java: 'Muestra tanto la implementación independiente como la integración con Command.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Menos flexible, enfocado en guardar/restaurar estados completos.',
      cppModern: 'Más flexible con CommandManager permitiendo deshacer operaciones específicas.',
      java: 'Ofrece ambos enfoques: restauración de estados completos y deshacer operaciones específicas.'
    }
  ],
  
  notes: 'El patrón Memento es fundamental para implementar funcionalidades de "deshacer" (undo) en aplicaciones. Es comúnmente usado en editores de texto, aplicaciones gráficas y juegos. A menudo se combina con el patrón Command para lograr un historial completo de operaciones. Considera usar técnicas como Copy-on-Write o almacenamiento incremental para estados grandes para minimizar el consumo de memoria. En aplicaciones web modernas, este patrón puede aplicarse para la persistencia del estado del cliente o para implementar viajes en el tiempo de estado (time-travel debugging).'
};

export default mementoPattern; 