const commandPattern = {
  id: 'command',
  name: 'Command',
  category: 'behavioral',
  description: 'Encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes peticiones, encolar o registrar solicitudes, y soportar operaciones que pueden deshacerse. Convierte las peticiones en objetos independientes que contienen toda la información sobre la solicitud, facilitando la extensibilidad del sistema y el desacoplamiento entre quien invoca las operaciones y quien las ejecuta. Este patrón es fundamental para implementar características como deshacer/rehacer, transacciones, colas de operaciones y callbacks orientados a objetos.',
  
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
    background: 'El patrón Command fue formalizado por la Banda de los Cuatro (GoF) y se inspira en el concepto de callbacks y pasaje de mensajes. Su idea central es convertir una petición en un objeto independiente que contiene toda la información necesaria para ejecutar la acción o desencadenarla posteriormente. Este enfoque permite desacoplar objetos que solicitan operaciones de los que saben cómo ejecutarlas. El patrón toma inspiración de sistemas operativos y entornos GUI donde las acciones del usuario se encapsulan como "comandos" que pueden ser invocados de múltiples formas (menús, botones, atajos de teclado) y además permiten características como deshacer/rehacer. Su influencia se extiende a numerosos frameworks modernos, arquitecturas orientadas a eventos y sistemas de mensajería.',
    
    problem: 'En muchos sistemas, necesitamos desacoplar el objeto que invoca una operación del objeto que sabe cómo realizarla. Además, frecuentemente necesitamos soportar características como: deshacer/rehacer operaciones, encolar solicitudes para procesamiento posterior, programar ejecuciones, implementar transacciones complejas compuestas por operaciones más simples, o registrar modificaciones para auditoría o recuperación. Si implementamos estas operaciones directamente en el código cliente, resulta en alta complejidad, acoplamiento rígido y dificultad para extender el sistema con nuevas funcionalidades. El problema se agrava cuando las mismas operaciones deben invocarse desde múltiples puntos de la aplicación o cuando los receptores de las solicitudes pueden cambiar dinámicamente.',
    
    solution: 'El patrón Command encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes, y soportar operaciones que pueden deshacerse. Separa el objeto que invoca la operación (Invoker) del que tiene el conocimiento para ejecutarla (Receiver), utilizando un objeto Command como intermediario que define una interfaz común para ejecutar operaciones. Este diseño permite tratar los comandos como objetos de primera clase: pueden pasarse como parámetros, almacenarse para uso posterior, modificarse o extenderse mediante herencia, y organizarse en estructuras complejas utilizando el patrón Composite para comandos compuestos. Los comandos pueden mantener estado, lo que permite implementar operaciones de deshacer al almacenar los datos necesarios para revertir sus efectos.',
    
    applicability: [
      'Para parametrizar objetos con una acción a realizar, de manera similar a los callbacks en programación funcional',
      'Para especificar, encolar y ejecutar solicitudes en diferentes momentos, incluso en hilos separados',
      'Para implementar operaciones deshacer/rehacer, manteniendo un historial de comandos ejecutados',
      'Para estructurar un sistema basado en operaciones de alto nivel construidas sobre operaciones primitivas',
      'Para implementar transacciones, donde un conjunto de operaciones se trata como una unidad que puede deshacerse completamente si alguna de ellas falla',
      'Para modelar sistemas basados en peticiones donde el emisor y el receptor deben estar desacoplados',
      'Cuando necesitas registrar (logging) operaciones para auditoría, debugging o recuperación ante fallos',
      'En interfaces gráficas para manejar acciones del usuario que pueden invocarse desde múltiples elementos UI',
      'En sistemas distribuidos para representar operaciones remotas como objetos locales',
      'Para implementar mecanismos de reintentos y compensación en operaciones que pueden fallar',
      'Cuando necesitas soportar la programación de tareas para ejecución futura o repetitiva',
      'Para implementar sistemas basados en eventos donde las acciones pueden ser disparadas por diferentes condiciones'
    ],
    
    consequences: [
      'Desacopla el objeto que invoca la operación del objeto que sabe cómo implementarla',
      'Los comandos son objetos de primera clase que pueden manipularse y extenderse como cualquier otro objeto',
      'Facilita añadir nuevos comandos sin modificar el código existente, siguiendo el principio abierto/cerrado',
      'Permite implementar deshacer/rehacer, registro de operaciones y transacciones compuestas',
      'Permite ensamblar comandos complejos a partir de comandos simples (usando el patrón Composite)',
      'Puede crear muchas clases pequeñas, aumentando la complejidad estructural del sistema',
      'Si los comandos son muy simples, introducir clases específicas puede ser una sobrecarga innecesaria',
      'La implementación de operaciones deshacer puede ser compleja para acciones que modifican datos compartidos',
      'Mejora la extensibilidad del sistema, permitiendo agregar nuevas acciones con mínimo impacto',
      'Facilita la implementación de características avanzadas como transacciones, colas, y planificación',
      'Puede aumentar la complejidad del código si se usa indiscriminadamente para operaciones simples',
      'Implementar el mecanismo de deshacer/rehacer de forma robusta puede requerir considerable esfuerzo',
      'Puede introducir sobrecarga de rendimiento debido a la capa adicional de indirección',
      'En sistemas distribuidos, debe considerarse la idempotencia de los comandos para manejar reenvíos y fallos'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Command?</h3>
      <ul>
        <li><strong>Interfaces de usuario:</strong> Para implementar acciones desencadenadas por elementos de la interfaz como botones, menús o atajos de teclado. Esto permite que múltiples elementos UI invoquen la misma acción y facilita la implementación de funciones como desactivar comandos no disponibles.</li>
        <li><strong>Operaciones deshacer/rehacer:</strong> Cuando necesitas mantener un historial de operaciones para poder deshacerlas. Los editores de texto, herramientas de diseño gráfico y muchas aplicaciones profesionales requieren esta funcionalidad.</li>
        <li><strong>Procesamiento asíncrono:</strong> Para encolar solicitudes que se ejecutarán posteriormente o en hilos diferentes. Útil para operaciones de larga duración que no deben bloquear la interfaz de usuario.</li>
        <li><strong>Transacciones:</strong> Para agrupar operaciones que deben ejecutarse como una unidad atómica, permitiendo revertir todas las operaciones si alguna falla, similar a las transacciones en bases de datos.</li>
        <li><strong>Planificación de tareas:</strong> Cuando necesitas programar la ejecución de comandos en momentos específicos o como respuesta a determinados eventos.</li>
        <li><strong>Macros:</strong> Para grabar secuencias de acciones que pueden reproducirse posteriormente. Útil en aplicaciones de automatización o diseño.</li>
        <li><strong>Callbacks orientados a objetos:</strong> Como alternativa orientada a objetos para implementar callbacks en sistemas donde la programación funcional no es óptima o donde necesitas mayor encapsulación y control.</li>
        <li><strong>Sistemas de scripts:</strong> Para implementar intérpretes de comandos o lenguajes específicos de dominio donde cada instrucción se convierte en un objeto comando.</li>
        <li><strong>Integración de subsistemas:</strong> Para mediar entre subsistemas con interfaces diferentes, encapsulando comandos específicos para cada subsistema.</li>
        <li><strong>Operaciones remotas:</strong> Para encapsular peticiones a servicios remotos como objetos que pueden ser enviados a través de la red, procesados y potencialmente reintentados en caso de fallo.</li>
      </ul>
      
      <h3>Variantes del patrón Command:</h3>
      <ul>
        <li><strong>Command simple:</strong> Implementación básica sin capacidad de deshacer, útil para operaciones de un solo sentido como registro de logs o envío de notificaciones.</li>
        <li><strong>Command con deshacer:</strong> Incluye un método undo() que revierte los efectos de la ejecución. Puede implementarse de varias formas:
          <ul>
            <li>Almacenando el estado anterior antes de ejecutar</li>
            <li>Ejecutando la operación inversa</li>
            <li>Usando un patrón Memento para restaurar estados completos</li>
          </ul>
        </li>
        <li><strong>Macro Command (Composite Command):</strong> Implementa el patrón Composite para agrupar múltiples comandos en uno solo, procesándolos en secuencia. Útil para operaciones complejas que se componen de varios pasos.</li>
        <li><strong>Command con log:</strong> Registra las operaciones ejecutadas en almacenamiento persistente para recuperación ante fallos, auditoría o reproducción posterior.</li>
        <li><strong>Lazy Command:</strong> Retrasa la ejecución hasta que realmente sea necesaria, optimizando recursos en sistemas con muchas operaciones potenciales.</li>
        <li><strong>Command funcional:</strong> Implementado con funciones de orden superior, lambdas o closures en lenguajes que soportan programación funcional, reduciendo la necesidad de clases completas.</li>
        <li><strong>Command con prioridad:</strong> Añade niveles de prioridad para determinar el orden de ejecución en una cola, útil para sistemas donde algunas operaciones son más críticas que otras.</li>
        <li><strong>Command con reintento:</strong> Incorpora lógica para reintentar la ejecución en caso de fallos, ideal para operaciones en entornos distribuidos o con recursos no confiables.</li>
        <li><strong>Command con timeout:</strong> Limita el tiempo de ejecución de un comando, cancelándolo si excede un umbral predefinido.</li>
        <li><strong>Command evento (Event):</strong> Variante utilizada en sistemas basados en eventos donde los comandos representan respuestas a eventos específicos.</li>
        <li><strong>Command con compensación:</strong> En lugar de deshacer directamente, implementa una operación compensatoria que neutraliza los efectos del comando. Útil en sistemas distribuidos donde no se puede garantizar un rollback perfecto.</li>
        <li><strong>Command idempotente:</strong> Diseñado para producir el mismo resultado sin importar cuántas veces se ejecute, crucial para sistemas distribuidos donde los comandos pueden duplicarse.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Editores de texto:</strong> Cada acción de edición (insertar, borrar, formatear) se implementa como un comando. Por ejemplo, en un editor como VS Code, cada operación es un comando que puede deshacerse:
        <pre>
// Ejemplo conceptual de un comando de editor de texto
class InsertTextCommand implements Command {
  private document: TextDocument;
  private position: Position;
  private text: string;
  private deletedText: string = "";
  
  constructor(doc: TextDocument, pos: Position, text: string) {
    this.document = doc;
    this.position = pos;
    this.text = text;
  }
  
  execute(): void {
    // Guarda texto que podría ser sobrescrito para deshacer
    this.deletedText = this.document.getTextAt(
      this.position, 
      this.text.length
    );
    this.document.insert(this.position, this.text);
  }
  
  undo(): void {
    this.document.delete(this.position, this.text.length);
    if (this.deletedText.length > 0) {
      this.document.insert(this.position, this.deletedText);
    }
  }
}
        </pre>
        </li>
        <li><strong>Interfaces gráficas:</strong> Frameworks como Swing en Java, WPF en .NET, o componentes en React utilizan comandos para representar acciones del usuario.</li>
        <li><strong>Transacciones de base de datos:</strong> Las operaciones CRUD se implementan como comandos que pueden revertirse si la transacción falla. Sistemas ORM como Hibernate o Entity Framework utilizan este patrón internamente.</li>
        <li><strong>Sistemas de control remoto:</strong> Cada botón del control invoca un comando específico en el dispositivo receptor, permitiendo reprogramar funciones sin cambiar la interfaz física.</li>
        <li><strong>Servidores web:</strong> Las peticiones HTTP se convierten en comandos que el servidor procesa. Frameworks MVC como Spring MVC o ASP.NET utilizan este concepto para manejar requests.</li>
        <li><strong>Sistemas de juegos:</strong> Las entradas del usuario y las acciones del juego se encapsulan como comandos, facilitando la implementación de replays, macros y configuración de controles.</li>
        <li><strong>Robótica:</strong> Las instrucciones para robots se modelan como secuencias de comandos que pueden planificarse, validarse o simularse antes de ejecutarse.</li>
        <li><strong>Arquitecturas orientadas a eventos (Event Sourcing):</strong> Los cambios de estado se modelan como secuencias de comandos, permitiendo reconstruir el estado del sistema reproduciendo estos comandos.</li>
        <li><strong>Message brokers:</strong> Sistemas como RabbitMQ o Kafka tratan los mensajes como comandos serializados que se enrutan a los procesadores adecuados.</li>
        <li><strong>Microservicios:</strong> El patrón CQRS (Command Query Responsibility Segregation) utiliza comandos para representar operaciones que modifican estado.</li>
        <li><strong>E-commerce:</strong> Implementación de carritos de compra donde cada acción (añadir producto, aplicar descuento) es un comando que puede revertirse. Ejemplo:
        <pre>
// Sistema de pedidos con patrón Command
class AddToCartCommand implements Command {
  constructor(private cart: ShoppingCart, 
              private product: Product, 
              private quantity: number) {}
  
  private originalQuantity = 0;
  
  execute(): void {
    // Guardar estado para poder deshacer
    const existing = this.cart.findItem(this.product.id);
    this.originalQuantity = existing ? existing.quantity : 0;
    
    // Ejecutar la operación
    this.cart.addItem(this.product, this.quantity);
    this.cart.recalculateTotal();
  }
  
  undo(): void {
    if (this.originalQuantity === 0) {
      this.cart.removeItem(this.product.id);
    } else {
      this.cart.updateQuantity(this.product.id, this.originalQuantity);
    }
    this.cart.recalculateTotal();
  }
}
        </pre>
        </li>
      </ul>
      
      <h3>Implementación efectiva:</h3>
      <ul>
        <li><strong>Comandos inteligentes vs. comandos tontos:</strong> Decide si los comandos contendrán la lógica de negocio (inteligentes) o serán simples delegadores al receptor (tontos). Los comandos inteligentes son más autónomos pero menos reutilizables, mientras que los tontos dependen más del receptor pero son más flexibles.</li>
        <li><strong>Estado en comandos:</strong> Los comandos inmutables son más seguros para operaciones asíncronas, mientras que comandos con estado facilitan la implementación de undo/redo.</li>
        <li><strong>Parámetros vs. estado:</strong> Evalúa si pasar los parámetros en la ejecución o almacenarlos en el comando al construirlo. Almacenarlos en el constructor hace que el comando sea más autónomo pero menos flexible.</li>
        <li><strong>Gestión de memoria:</strong> En sistemas con muchos comandos, considera usar un object pool o comandos flyweight para reducir la sobrecarga. Esto es especialmente importante en entornos de recursos limitados.</li>
        <li><strong>Serialización:</strong> Para comandos en sistemas distribuidos o persistentes, diseña comandos que sean fácilmente serializables. Considera la separación entre los datos del comando y su comportamiento.</li>
        <li><strong>Validación:</strong> Decide si la validación ocurre al crear el comando o al ejecutarlo. La validación temprana evita crear comandos inválidos, pero la validación tardía permite evaluar condiciones que solo son conocidas al momento de la ejecución.</li>
        <li><strong>Composición vs. herencia:</strong> Prefiere componer comandos complejos a partir de simples en lugar de crear jerarquías de herencia profundas. Esto facilita la reutilización y reduce la complejidad.</li>
        <li><strong>Threading y concurrencia:</strong> Diseña comandos thread-safe si se ejecutarán en entornos multihilo. Considera la inmutabilidad como estrategia para facilitar la concurrencia.</li>
        <li><strong>Manejo del historial:</strong> En sistemas con deshacer/rehacer, gestiona cuidadosamente el tamaño del historial para evitar consumo excesivo de memoria. Técnicas como snapshots periódicos pueden reducir la cantidad de comandos almacenados.</li>
        <li><strong>Comandos para deshacer:</strong> En lugar de tener un método "undo" en cada comando, considera implementar "comandos inversos" específicos para deshacer operaciones complejas, separando la responsabilidad.</li>
      </ul>
      
      <h3>Command vs Strategy vs Visitor vs Observer:</h3>
      <ul>
        <li><strong>Command:</strong> Encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes peticiones. Se centra en la acción y puede almacenarse para uso posterior. El receptor típicamente ya existe y el comando lo utiliza para realizar una operación específica.</li>
        <li><strong>Strategy:</strong> Define una familia de algoritmos intercambiables. Mientras Command se enfoca en encapsular una solicitud, Strategy se centra en encapsular algoritmos para hacer lo mismo de diferentes maneras. Las estrategias suelen ser más permanentes, mientras que los comandos pueden ser efímeros.</li>
        <li><strong>Visitor:</strong> Permite añadir nuevas operaciones a una jerarquía de objetos sin modificarlos. A diferencia de Command, que encapsula una solicitud, Visitor encapsula operaciones que se aplican a estructuras de objetos existentes.</li>
        <li><strong>Observer:</strong> Define una dependencia uno-a-muchos entre objetos. A diferencia de Command que maneja solicitudes explícitas, Observer maneja notificaciones automáticas cuando cambia el estado de un objeto.</li>
        <li><strong>Memento:</strong> A menudo se usa junto con Command para implementar undo/redo almacenando estados completos en lugar de operaciones inversas.</li>
        <li><strong>Chain of Responsibility:</strong> Procesa solicitudes secuencialmente a través de una cadena de manejadores, mientras que Command encapsula la solicitud como un objeto independiente.</li>
      </ul>
    `
  }
};

export default commandPattern;
