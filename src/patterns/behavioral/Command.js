const commandPattern = {
  id: 'command',
  name: 'Command',
  category: 'behavioral',
  description: 'El patrón Command encapsula una solicitud como un objeto, permitiendo parametrizar a los clientes con diferentes solicitudes, encolar o registrar solicitudes y soportar operaciones que pueden deshacerse.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <stack>
#include <memory>

// Receptor que realiza la acción real
class Receiver {
public:
    void action(const std::string& text) {
        std::cout << "Receiver: " << text << std::endl;
    }
};

// Interfaz Command
class Command {
public:
    virtual ~Command() {}
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual std::string getDescription() const = 0;
};

// Comando concreto que trabaja con el Receptor
class ConcreteCommand : public Command {
private:
    Receiver* receiver;
    std::string action;
    
public:
    ConcreteCommand(Receiver* receiver, const std::string& action)
        : receiver(receiver), action(action) {}
    
    void execute() override {
        receiver->action("Ejecutando: " + action);
    }
    
    void undo() override {
        receiver->action("Deshaciendo: " + action);
    }
    
    std::string getDescription() const override {
        return action;
    }
};

// Invocador que mantiene una referencia al comando y lo ejecuta
class Invoker {
private:
    Command* command;
    std::stack<Command*> history;
    
public:
    void setCommand(Command* cmd) {
        command = cmd;
    }
    
    void executeCommand() {
        if (command) {
            command->execute();
            history.push(command);
        }
    }
    
    void undoLastCommand() {
        if (!history.empty()) {
            Command* lastCommand = history.top();
            history.pop();
            lastCommand->undo();
        } else {
            std::cout << "No hay comandos para deshacer" << std::endl;
        }
    }
    
    void showHistory() const {
        std::stack<Command*> tempStack = history;
        if (tempStack.empty()) {
            std::cout << "Historial vacío" << std::endl;
            return;
        }
        
        std::cout << "Historial de comandos:" << std::endl;
        int count = tempStack.size();
        while (!tempStack.empty()) {
            std::cout << count-- << ": " << tempStack.top()->getDescription() << std::endl;
            tempStack.pop();
        }
    }
};

// Demostración del patrón Command
int main() {
    // Crear el receptor
    Receiver receiver;
    
    // Crear comandos concretos
    ConcreteCommand cmd1(&receiver, "Comando 1");
    ConcreteCommand cmd2(&receiver, "Comando 2");
    ConcreteCommand cmd3(&receiver, "Comando 3");
    
    // Configurar el invocador
    Invoker invoker;
    
    // Ejecutar comandos
    invoker.setCommand(&cmd1);
    invoker.executeCommand();
    
    invoker.setCommand(&cmd2);
    invoker.executeCommand();
    
    invoker.setCommand(&cmd3);
    invoker.executeCommand();
    
    // Mostrar historial
    invoker.showHistory();
    
    // Deshacer comandos
    std::cout << "\nDeshaciendo comandos:" << std::endl;
    invoker.undoLastCommand();
    invoker.undoLastCommand();
    
    // Mostrar historial actualizado
    invoker.showHistory();
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para el patrón Command.' },
        { line: 7, text: 'La clase Receiver realiza la acción real cuando se ejecuta un comando.' },
        { line: 9, text: 'El método action implementa la funcionalidad real que los comandos invocarán.' },
        { line: 14, text: 'Definimos la interfaz Command con los métodos execute() y undo().' },
        { line: 16, text: 'El destructor virtual es necesario para la correcta destrucción de los comandos derivados.' },
        { line: 17, text: 'execute() realiza la acción del comando.' },
        { line: 18, text: 'undo() deshace la acción del comando, si es posible.' },
        { line: 19, text: 'getDescription() proporciona información sobre el comando para propósitos de seguimiento.' },
        { line: 23, text: 'ConcreteCommand implementa la interfaz Command para una acción específica.' },
        { line: 25, text: 'Mantiene una referencia al receptor que realizará la acción y la descripción de la acción.' },
        { line: 30, text: 'Al ejecutar, delega en el receptor para realizar la acción real.' },
        { line: 34, text: 'Al deshacer, realiza la operación inversa a través del receptor.' },
        { line: 42, text: 'El Invoker mantiene una referencia al comando actual y un historial de comandos ejecutados.' },
        { line: 44, text: 'Usamos una pila (stack) para almacenar el historial, lo que facilita deshacer en orden LIFO.' },
        { line: 48, text: 'setCommand configura el comando que se ejecutará.' },
        { line: 52, text: 'executeCommand invoca el comando actual y lo añade al historial.' },
        { line: 58, text: 'undoLastCommand deshace el último comando ejecutado y lo elimina del historial.' },
        { line: 67, text: 'showHistory muestra el historial de comandos ejecutados.' },
        { line: 86, text: 'Creamos un receptor que realizará las acciones reales.' },
        { line: 89, text: 'Creamos varios comandos concretos asociados al receptor.' },
        { line: 94, text: 'Configuramos el invocador y ejecutamos varios comandos.' },
        { line: 105, text: 'Mostramos el historial de comandos ejecutados.' },
        { line: 108, text: 'Demostramos la funcionalidad de deshacer comandos.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <stack>
#include <memory>
#include <functional>
#include <utility>

// Receptor moderno usando smart pointers
class Receiver {
public:
    void action(const std::string& text) const {
        std::cout << "Receiver: " << text << std::endl;
    }
};

// Interfaz Command usando smart pointers
class Command {
public:
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual std::string getDescription() const = 0;
};

// Comando concreto usando smart pointers
class ConcreteCommand : public Command {
private:
    std::shared_ptr<Receiver> receiver;
    std::string action;
    
public:
    ConcreteCommand(std::shared_ptr<Receiver> receiver, std::string action)
        : receiver(std::move(receiver)), action(std::move(action)) {}
    
    void execute() override {
        receiver->action("Ejecutando: " + action);
    }
    
    void undo() override {
        receiver->action("Deshaciendo: " + action);
    }
    
    std::string getDescription() const override {
        return action;
    }
};

// Comando funcional usando functors
class FunctionalCommand : public Command {
private:
    std::function<void()> executeFunc;
    std::function<void()> undoFunc;
    std::string description;
    
public:
    FunctionalCommand(std::function<void()> execute, 
                      std::function<void()> undo,
                      std::string description)
        : executeFunc(std::move(execute)), 
          undoFunc(std::move(undo)),
          description(std::move(description)) {}
    
    void execute() override {
        executeFunc();
    }
    
    void undo() override {
        undoFunc();
    }
    
    std::string getDescription() const override {
        return description;
    }
};

// Invocador moderno con smart pointers
class Invoker {
private:
    std::shared_ptr<Command> command;
    std::stack<std::shared_ptr<Command>> history;
    
public:
    void setCommand(std::shared_ptr<Command> cmd) {
        command = std::move(cmd);
    }
    
    void executeCommand() {
        if (command) {
            command->execute();
            history.push(command);
        }
    }
    
    void undoLastCommand() {
        if (!history.empty()) {
            auto lastCommand = history.top();
            history.pop();
            lastCommand->undo();
        } else {
            std::cout << "No hay comandos para deshacer" << std::endl;
        }
    }
    
    void showHistory() const {
        auto tempStack = history;
        if (tempStack.empty()) {
            std::cout << "Historial vacío" << std::endl;
            return;
        }
        
        std::cout << "Historial de comandos:" << std::endl;
        int count = tempStack.size();
        while (!tempStack.empty()) {
            std::cout << count-- << ": " << tempStack.top()->getDescription() << std::endl;
            tempStack.pop();
        }
    }
};

// Demostración del patrón Command moderno
int main() {
    // Crear el receptor con smart pointer
    auto receiver = std::make_shared<Receiver>();
    
    // Crear comandos concretos con smart pointers
    auto cmd1 = std::make_shared<ConcreteCommand>(receiver, "Comando 1");
    auto cmd2 = std::make_shared<ConcreteCommand>(receiver, "Comando 2");
    
    // Crear comando funcional con lambdas
    auto cmd3 = std::make_shared<FunctionalCommand>(
        [receiver]() { receiver->action("Ejecutando: Comando funcional"); },
        [receiver]() { receiver->action("Deshaciendo: Comando funcional"); },
        "Comando funcional"
    );
    
    // Configurar el invocador
    Invoker invoker;
    
    // Ejecutar comandos
    invoker.setCommand(cmd1);
    invoker.executeCommand();
    
    invoker.setCommand(cmd2);
    invoker.executeCommand();
    
    invoker.setCommand(cmd3);
    invoker.executeCommand();
    
    // Mostrar historial
    invoker.showHistory();
    
    // Deshacer comandos
    std::cout << "\nDeshaciendo comandos:" << std::endl;
    invoker.undoLastCommand();
    invoker.undoLastCommand();
    
    // Mostrar historial actualizado
    invoker.showHistory();
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos bibliotecas adicionales para functores y utilidades.' },
        { line: 9, text: 'El Receiver es similar, pero ahora sus métodos son const para mejor encapsulación.' },
        { line: 17, text: 'La interfaz Command usa =default para el destructor, siguiendo las recomendaciones modernas.' },
        { line: 31, text: 'Usamos std::move para transferir la propiedad de los strings al constructor.' },
        { line: 47, text: 'Añadimos FunctionalCommand que usa std::function para implementar comandos como functores.' },
        { line: 53, text: 'El constructor toma functores para execute y undo, junto con una descripción.' },
        { line: 72, text: 'El Invoker ahora utiliza std::shared_ptr para gestionar la memoria automáticamente.' },
        { line: 78, text: 'setCommand ahora toma un std::shared_ptr.' },
        { line: 106, text: 'Creamos el receptor usando std::make_shared.' },
        { line: 109, text: 'Creamos comandos concretos con smart pointers.' },
        { line: 113, text: 'Creamos un comando funcional usando lambdas, mostrando la flexibilidad del enfoque moderno.' },
        { line: 114, text: 'Lambda para la acción execute que captura el receptor.' },
        { line: 115, text: 'Lambda para la acción undo correspondiente.' }
      ]
    },
    
    java: {
      code: `import java.util.Stack;
import java.util.function.Consumer;

// Interfaz Command
interface Command {
    void execute();
    void undo();
    String getDescription();
}

// Receptor que realiza la acción real
class Receiver {
    public void action(String text) {
        System.out.println("Receiver: " + text);
    }
}

// Comando concreto que trabaja con el Receptor
class ConcreteCommand implements Command {
    private final Receiver receiver;
    private final String action;
    
    public ConcreteCommand(Receiver receiver, String action) {
        this.receiver = receiver;
        this.action = action;
    }
    
    @Override
    public void execute() {
        receiver.action("Ejecutando: " + action);
    }
    
    @Override
    public void undo() {
        receiver.action("Deshaciendo: " + action);
    }
    
    @Override
    public String getDescription() {
        return action;
    }
}

// Comando funcional usando lambdas
class FunctionalCommand implements Command {
    private final Runnable executeAction;
    private final Runnable undoAction;
    private final String description;
    
    public FunctionalCommand(Runnable executeAction, Runnable undoAction, String description) {
        this.executeAction = executeAction;
        this.undoAction = undoAction;
        this.description = description;
    }
    
    @Override
    public void execute() {
        executeAction.run();
    }
    
    @Override
    public void undo() {
        undoAction.run();
    }
    
    @Override
    public String getDescription() {
        return description;
    }
}

// Invocador que mantiene una referencia al comando actual y un historial
class Invoker {
    private Command command;
    private final Stack<Command> history = new Stack<>();
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void executeCommand() {
        if (command != null) {
            command.execute();
            history.push(command);
        }
    }
    
    public void undoLastCommand() {
        if (!history.isEmpty()) {
            Command lastCommand = history.pop();
            lastCommand.undo();
        } else {
            System.out.println("No hay comandos para deshacer");
        }
    }
    
    public void showHistory() {
        if (history.isEmpty()) {
            System.out.println("Historial vacío");
            return;
        }
        
        System.out.println("Historial de comandos:");
        // Convertimos a array para no modificar la pila original
        Object[] commands = history.toArray();
        for (int i = commands.length - 1; i >= 0; i--) {
            Command cmd = (Command) commands[i];
            System.out.println((i + 1) + ": " + cmd.getDescription());
        }
    }
}

// Clase de demostración
public class CommandDemo {
    public static void main(String[] args) {
        // Crear el receptor
        Receiver receiver = new Receiver();
        
        // Crear comandos concretos
        Command cmd1 = new ConcreteCommand(receiver, "Comando 1");
        Command cmd2 = new ConcreteCommand(receiver, "Comando 2");
        
        // Crear comando funcional con lambdas
        Command cmd3 = new FunctionalCommand(
            () -> receiver.action("Ejecutando: Comando funcional"),
            () -> receiver.action("Deshaciendo: Comando funcional"),
            "Comando funcional"
        );
        
        // Configurar el invocador
        Invoker invoker = new Invoker();
        
        // Ejecutar comandos
        invoker.setCommand(cmd1);
        invoker.executeCommand();
        
        invoker.setCommand(cmd2);
        invoker.executeCommand();
        
        invoker.setCommand(cmd3);
        invoker.executeCommand();
        
        // Mostrar historial
        invoker.showHistory();
        
        // Deshacer comandos
        System.out.println("\nDeshaciendo comandos:");
        invoker.undoLastCommand();
        invoker.undoLastCommand();
        
        // Mostrar historial actualizado
        invoker.showHistory();
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias, como Stack para el historial de comandos.' },
        { line: 4, text: 'Definimos la interfaz Command con métodos para ejecutar, deshacer y obtener información del comando.' },
        { line: 11, text: 'La clase Receiver implementa la funcionalidad real que los comandos invocarán.' },
        { line: 18, text: 'ConcreteCommand implementa la interfaz Command para trabajar con un Receptor específico.' },
        { line: 20, text: 'Usamos final para indicar que estos campos no cambiarán después de la inicialización.' },
        { line: 28, text: 'Delegamos la ejecución al receptor.' },
        { line: 33, text: 'Implementamos undo para permitir deshacer la acción.' },
        { line: 41, text: 'FunctionalCommand es una implementación alternativa que usa lambdas en lugar de un receptor concreto.' },
        { line: 43, text: 'Almacenamos las acciones como objetos Runnable que pueden ser ejecutados.' },
        { line: 53, text: 'Ejecutamos la acción llamando a run() en el Runnable.' },
        { line: 64, text: 'El Invoker gestiona tanto el comando actual como el historial de comandos ejecutados.' },
        { line: 66, text: 'Usamos una Stack para mantener el historial, lo que facilita las operaciones LIFO.' },
        { line: 74, text: 'Al ejecutar un comando, lo añadimos al historial para poder deshacerlo después.' },
        { line: 81, text: 'Para deshacer, sacamos el último comando del historial y llamamos a su método undo().' },
        { line: 91, text: 'showHistory muestra todos los comandos en el historial sin modificar la pila original.' },
        { line: 94, text: 'Convertimos la pila a un array para recorrerla sin alterarla.' },
        { line: 114, text: 'Demostramos cómo crear un comando funcional usando expresiones lambda.' },
        { line: 127, text: 'Mostramos cómo se ejecutan los comandos y cómo se mantiene el historial.' },
        { line: 137, text: 'Finalmente, demostramos cómo deshacer comandos.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Utiliza punteros crudos (raw pointers) para referenciar objetos Command y Receiver. Requiere gestión manual de memoria y cuidado para evitar fugas de memoria.',
      cppModern: 'Emplea smart pointers (shared_ptr) para gestión automática de la memoria. El uso de smart pointers elimina la necesidad de gestión manual y evita fugas de memoria.',
      java: 'La memoria es gestionada automáticamente por el recolector de basura. No requiere liberación manual de recursos.'
    },
    {
      title: 'Implementación de comandos',
      cppTraditional: 'Implementación orientada a objetos pura con herencia. Los comandos concretos heredan de una clase abstracta Command y sobrescriben los métodos virtuales.',
      cppModern: 'Combina enfoque orientado a objetos con programación funcional. Introduce FunctionalCommand que utiliza std::function para permitir lambdas y functores.',
      java: 'Similar al enfoque moderno en C++, permite tanto implementaciones orientadas a objetos tradicionales como funcionales usando Runnable y expresiones lambda.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'Menor flexibilidad para variar comportamientos en tiempo de ejecución. Cada nuevo comando requiere una nueva clase.',
      cppModern: 'Mayor flexibilidad con functores y lambdas. Permite crear comandos ad-hoc sin definir nuevas clases.',
      java: 'Ofrece un buen equilibrio entre orientación a objetos y programación funcional. Las expresiones lambda simplifican la creación de comandos simples.'
    }
  ],
  
  theory: {
    background: 'El patrón Command fue introducido como parte de los 23 patrones del Gang of Four (GoF). Tiene raíces en la programación orientada a objetos y está inspirado en la idea de callbacks y pasaje de mensajes.',
    problem: 'Necesitamos desacoplar el objeto que invoca una operación del objeto que sabe cómo realizarla. Además, queremos soportar operaciones como deshacer/rehacer, encolar solicitudes, registrar operaciones, o incluso crear transacciones complejas componiendo comandos.',
    solution: 'El patrón Command encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes, y soportar operaciones que pueden deshacerse. Separa el objeto que invoca la operación del que tiene el conocimiento para ejecutarla.',
    applicability: [
      'Para parametrizar objetos con una acción a realizar, similar a los callbacks.',
      'Para especificar, encolar y ejecutar solicitudes en diferentes momentos.',
      'Para soportar deshacer/rehacer operaciones, manteniendo un historial de comandos ejecutados.',
      'Para estructurar un sistema basado en operaciones de alto nivel construidas sobre operaciones primitivas.',
      'Para implementar transacciones, donde un conjunto de operaciones se trata como una sola unidad que puede ser deshecha si falla parcialmente.'
    ],
    benefits: [
      'Desacopla el objeto que invoca la operación del que la implementa.',
      'Los comandos son objetos de primera clase que pueden ser manipulados y extendidos.',
      'Facilita añadir nuevos comandos sin cambiar el código existente.',
      'Permite implementar deshacer/rehacer, registro (logging) y transacciones.',
      'Permite componer comandos simples en comandos complejos (usando el patrón Composite).'
    ],
    drawbacks: [
      'Puede introducir muchas clases pequeñas en la aplicación, aumentando la complejidad.',
      'Si los comandos son muy simples, el overhead de crear clases específicas puede no justificarse.',
      'La implementación del mecanismo de deshacer puede ser compleja para operaciones que no son fácilmente reversibles.'
    ]
  }
};

export default commandPattern;
