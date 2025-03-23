const chainOfResponsibilityPattern = {
  id: 'chain-of-responsibility',
  name: 'Chain of Responsibility',
  category: 'behavioral',
  description: 'Permite que una solicitud sea procesada por múltiples manejadores organizados en una cadena secuencial. Cada manejador decide si procesa la solicitud o la pasa al siguiente en la cadena, evitando el acoplamiento entre el emisor y los receptores específicos, permitiendo asignar responsabilidades de forma dinámica y flexible. Este patrón es especialmente útil para implementar sistemas de filtrado, validación en múltiples etapas y flujos de aprobación jerárquicos.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Handler abstracto
class Handler {
protected:
    Handler* nextHandler;

public:
    Handler() : nextHandler(nullptr) {}
    virtual ~Handler() {}

    // Establecer el siguiente manejador en la cadena
    void setNext(Handler* handler) {
        nextHandler = handler;
    }

    // Método para manejar la solicitud o pasarla al siguiente manejador
    virtual void handleRequest(const std::string& request) = 0;
};

// Manejador concreto A
class ConcreteHandlerA : public Handler {
public:
    void handleRequest(const std::string& request) override {
        if (request == "A") {
            std::cout << "ConcreteHandlerA: Manejando solicitud " << request << std::endl;
        } else if (nextHandler != nullptr) {
            std::cout << "ConcreteHandlerA: Pasando solicitud al siguiente manejador" << std::endl;
            nextHandler->handleRequest(request);
        } else {
            std::cout << "ConcreteHandlerA: No puedo manejar la solicitud y no hay siguiente manejador" << std::endl;
        }
    }
};

// Manejador concreto B
class ConcreteHandlerB : public Handler {
public:
    void handleRequest(const std::string& request) override {
        if (request == "B") {
            std::cout << "ConcreteHandlerB: Manejando solicitud " << request << std::endl;
        } else if (nextHandler != nullptr) {
            std::cout << "ConcreteHandlerB: Pasando solicitud al siguiente manejador" << std::endl;
            nextHandler->handleRequest(request);
        } else {
            std::cout << "ConcreteHandlerB: No puedo manejar la solicitud y no hay siguiente manejador" << std::endl;
        }
    }
};

// Manejador concreto C
class ConcreteHandlerC : public Handler {
public:
    void handleRequest(const std::string& request) override {
        if (request == "C") {
            std::cout << "ConcreteHandlerC: Manejando solicitud " << request << std::endl;
        } else if (nextHandler != nullptr) {
            std::cout << "ConcreteHandlerC: Pasando solicitud al siguiente manejador" << std::endl;
            nextHandler->handleRequest(request);
        } else {
            std::cout << "ConcreteHandlerC: No puedo manejar la solicitud y no hay siguiente manejador" << std::endl;
        }
    }
};

// Cliente
int main() {
    // Crear manejadores
    ConcreteHandlerA* handlerA = new ConcreteHandlerA();
    ConcreteHandlerB* handlerB = new ConcreteHandlerB();
    ConcreteHandlerC* handlerC = new ConcreteHandlerC();

    // Configurar la cadena
    handlerA->setNext(handlerB);
    handlerB->setNext(handlerC);

    // Procesar solicitudes
    std::cout << "Enviando solicitud A a la cadena:" << std::endl;
    handlerA->handleRequest("A");
    
    std::cout << "\\nEnviando solicitud B a la cadena:" << std::endl;
    handlerA->handleRequest("B");
    
    std::cout << "\\nEnviando solicitud C a la cadena:" << std::endl;
    handlerA->handleRequest("C");
    
    std::cout << "\\nEnviando solicitud D a la cadena:" << std::endl;
    handlerA->handleRequest("D");

    // Limpiar memoria
    delete handlerA;
    delete handlerB;
    delete handlerC;

    return 0;
}`,
      explanation: [
        { line: 5, text: 'La clase Handler define la interfaz para todos los manejadores de la cadena.' },
        { line: 7, text: 'Cada manejador tiene una referencia al siguiente manejador en la cadena.' },
        { line: 13, text: 'Método para establecer el siguiente manejador, creando así la cadena.' },
        { line: 18, text: 'Método abstracto que cada manejador concreto debe implementar para procesar solicitudes.' },
        { line: 23, text: 'ConcreteHandlerA es un manejador específico que puede manejar solicitudes tipo "A".' },
        { line: 25, text: 'Si la solicitud es del tipo que este manejador puede manejar, lo hace.' },
        { line: 27, text: 'Si no puede manejar la solicitud y hay un siguiente manejador, pasa la solicitud al siguiente.' },
        { line: 29, text: 'Si no puede manejar la solicitud y no hay siguiente manejador, la cadena termina sin procesar la solicitud.' },
        { line: 36, text: 'ConcreteHandlerB es otro manejador específico para solicitudes tipo "B".' },
        { line: 49, text: 'ConcreteHandlerC maneja solicitudes tipo "C".' },
        { line: 65, text: 'En la función main creamos instancias de los manejadores concretos.' },
        { line: 71, text: 'Configuramos la cadena conectando los manejadores en un orden específico.' },
        { line: 75, text: 'Enviamos diferentes solicitudes al primer manejador de la cadena.' },
        { line: 86, text: 'Es importante liberar la memoria de los manejadores cuando ya no se necesitan.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <vector>
#include <functional>

// Sistema de logs basado en Chain of Responsibility
enum class LogLevel {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

// Mensaje de log con nivel y contenido
struct LogMessage {
    LogLevel level;
    std::string message;
    
    LogMessage(LogLevel lvl, const std::string& msg) : level(lvl), message(msg) {}
};

// Handler abstracto como clase base
class LogHandler {
protected:
    std::shared_ptr<LogHandler> nextHandler;
    LogLevel handlerLevel;
    std::string handlerName;

public:
    LogHandler(LogLevel level, const std::string& name) 
        : nextHandler(nullptr), handlerLevel(level), handlerName(name) {}
    
    virtual ~LogHandler() = default;
    
    // Establecer el siguiente manejador en la cadena
    void setNext(std::shared_ptr<LogHandler> handler) {
        nextHandler = handler;
    }
    
    // Método principal para manejar el mensaje de log
    void handleLog(const LogMessage& logMessage) {
        if (logMessage.level >= handlerLevel) {
            writeLog(logMessage);
        }
        
        // Pasar al siguiente manejador si existe
        if (nextHandler) {
            nextHandler->handleLog(logMessage);
        }
    }
    
    // Método que deben implementar las clases concretas
    virtual void writeLog(const LogMessage& logMessage) = 0;
};

// Manejador que escribe en la consola
class ConsoleLogHandler : public LogHandler {
public:
    ConsoleLogHandler(LogLevel level = LogLevel::INFO) 
        : LogHandler(level, "ConsoleLogger") {}
    
    void writeLog(const LogMessage& logMessage) override {
        std::cout << "CONSOLA [" << getLevelString(logMessage.level) << "]: " 
                  << logMessage.message << std::endl;
    }
    
private:
    std::string getLevelString(LogLevel level) {
        switch (level) {
            case LogLevel::INFO: return "INFO";
            case LogLevel::WARNING: return "WARNING";
            case LogLevel::ERROR: return "ERROR";
            case LogLevel::CRITICAL: return "CRITICAL";
            default: return "UNKNOWN";
        }
    }
};

// Manejador que escribe en un archivo
class FileLogHandler : public LogHandler {
private:
    std::string filename;

public:
    FileLogHandler(const std::string& file, LogLevel level = LogLevel::WARNING) 
        : LogHandler(level, "FileLogger"), filename(file) {}
    
    void writeLog(const LogMessage& logMessage) override {
        std::cout << "ARCHIVO " << filename << " [" 
                  << getLevelString(logMessage.level) << "]: " 
                  << logMessage.message << std::endl;
        // En una implementación real, abriríamos y escribiríamos en el archivo
    }
    
private:
    std::string getLevelString(LogLevel level) {
        switch (level) {
            case LogLevel::INFO: return "INFO";
            case LogLevel::WARNING: return "WARNING";
            case LogLevel::ERROR: return "ERROR";
            case LogLevel::CRITICAL: return "CRITICAL";
            default: return "UNKNOWN";
        }
    }
};

// Manejador que envía notificaciones
class EmailLogHandler : public LogHandler {
private:
    std::vector<std::string> recipients;

public:
    EmailLogHandler(const std::vector<std::string>& emails, LogLevel level = LogLevel::ERROR) 
        : LogHandler(level, "EmailLogger"), recipients(emails) {}
    
    void writeLog(const LogMessage& logMessage) override {
        std::cout << "EMAIL a ";
        for (const auto& recipient : recipients) {
            std::cout << recipient << " ";
        }
        std::cout << "[" << getLevelString(logMessage.level) << "]: " 
                  << logMessage.message << std::endl;
        // En una implementación real, enviaríamos un email
    }
    
private:
    std::string getLevelString(LogLevel level) {
        switch (level) {
            case LogLevel::INFO: return "INFO";
            case LogLevel::WARNING: return "WARNING";
            case LogLevel::ERROR: return "ERROR";
            case LogLevel::CRITICAL: return "CRITICAL";
            default: return "UNKNOWN";
        }
    }
};

// Clase para facilitar la construcción de la cadena de responsabilidad
class LoggerChain {
private:
    std::shared_ptr<LogHandler> firstHandler;
    std::shared_ptr<LogHandler> lastHandler;

public:
    LoggerChain() : firstHandler(nullptr), lastHandler(nullptr) {}
    
    // Añadir un manejador a la cadena
    LoggerChain& addHandler(std::shared_ptr<LogHandler> handler) {
        if (!firstHandler) {
            firstHandler = handler;
            lastHandler = handler;
        } else {
            lastHandler->setNext(handler);
            lastHandler = handler;
        }
        return *this;
    }
    
    // Método para enviar un mensaje a través de la cadena
    void log(LogLevel level, const std::string& message) {
        if (firstHandler) {
            LogMessage logMessage(level, message);
            firstHandler->handleLog(logMessage);
        }
    }
    
    // Métodos helper para diferentes niveles de log
    void info(const std::string& message) {
        log(LogLevel::INFO, message);
    }
    
    void warning(const std::string& message) {
        log(LogLevel::WARNING, message);
    }
    
    void error(const std::string& message) {
        log(LogLevel::ERROR, message);
    }
    
    void critical(const std::string& message) {
        log(LogLevel::CRITICAL, message);
    }
};

// Demostración
int main() {
    // Crear la cadena de manejadores
    LoggerChain loggerChain;
    
    // Configurar la cadena
    loggerChain.addHandler(std::make_shared<ConsoleLogHandler>(LogLevel::INFO))
              .addHandler(std::make_shared<FileLogHandler>("logs.txt", LogLevel::WARNING))
              .addHandler(std::make_shared<EmailLogHandler>(
                  std::vector<std::string>{"admin@example.com"}, 
                  LogLevel::CRITICAL));
    
    // Enviar diferentes mensajes
    std::cout << "Enviando mensaje INFO:" << std::endl;
    loggerChain.info("Operación completada con éxito");
    
    std::cout << "\\nEnviando mensaje WARNING:" << std::endl;
    loggerChain.warning("Espacio en disco bajo");
    
    std::cout << "\\nEnviando mensaje ERROR:" << std::endl;
    loggerChain.error("Error al procesar el archivo");
    
    std::cout << "\\nEnviando mensaje CRITICAL:" << std::endl;
    loggerChain.critical("¡Sistema caído! Se requiere intervención inmediata");
    
    return 0;
}`,
      explanation: [
        { line: 7, text: 'Definimos un enum LogLevel para representar los diferentes niveles de severidad de los logs.' },
        { line: 16, text: 'Estructura LogMessage que encapsula un mensaje de log y su nivel de severidad.' },
        { line: 22, text: 'LogHandler es la clase base abstracta para todos los manejadores de logs.' },
        { line: 36, text: 'Método para configurar el siguiente manejador en la cadena.' },
        { line: 41, text: 'El método handleLog determina si este manejador debe procesar el mensaje y luego lo pasa al siguiente.' },
        { line: 43, text: 'Cada manejador decide si procesa el mensaje basado en el nivel del mensaje y su propio nivel configurado.' },
        { line: 47, text: 'Siempre pasa el mensaje al siguiente manejador si existe, creando una cadena de procesamiento.' },
        { line: 53, text: 'Método writeLog abstracto que las clases concretas deben implementar.' },
        { line: 58, text: 'ConsoleLogHandler es un manejador concreto que escribe mensajes en la consola.' },
        { line: 62, text: 'Implementación de writeLog para escribir en la consola.' },
        { line: 81, text: 'FileLogHandler es otro manejador que simula escribir mensajes en un archivo.' },
        { line: 98, text: 'EmailLogHandler simula enviar mensajes por email a una lista de destinatarios.' },
        { line: 130, text: 'La clase LoggerChain facilita la creación y uso de la cadena de manejadores.' },
        { line: 138, text: 'Método para añadir manejadores a la cadena y configurar automáticamente el siguiente en cada uno.' },
        { line: 151, text: 'Método log para enviar un mensaje a través de la cadena con un nivel específico.' },
        { line: 158, text: 'Métodos helper para diferentes niveles de log para mayor comodidad.' },
        { line: 177, text: 'En main, creamos una cadena de logs con diferentes manejadores para diferentes niveles.' },
        { line: 181, text: 'Configuramos la cadena con un manejador de consola para INFO, archivo para WARNING y email para CRITICAL.' },
        { line: 187, text: 'Enviamos mensajes de diferentes niveles a través de la cadena.' }
      ]
    },
    
    java: {
      code: `import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

// Clase Request que representa la solicitud a ser procesada
class Request {
    private String type;
    private String content;
    private int amount;

    public Request(String type, String content, int amount) {
        this.type = type;
        this.content = content;
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public int getAmount() {
        return amount;
    }

    @Override
    public String toString() {
        return "Request{type='" + type + "', content='" + content + "', amount=" + amount + '}';
    }
}

// Interface para todos los manejadores
interface Approver {
    void setNext(Approver next);
    void processRequest(Request request);
}

// Clase base para manejadores que implementa la funcionalidad común
abstract class ApproverBase implements Approver {
    protected Approver next;
    protected String approverName;

    public ApproverBase(String name) {
        this.approverName = name;
    }

    @Override
    public void setNext(Approver next) {
        this.next = next;
    }

    // Método para pasar la solicitud al siguiente manejador
    protected void passToNext(Request request) {
        if (next != null) {
            next.processRequest(request);
        } else {
            System.out.println("Fin de la cadena. Solicitud no procesada completamente: " + request);
        }
    }
}

// Manejador para solicitudes de gastos
class ExpenseHandler extends ApproverBase {
    private int maxAmount;

    public ExpenseHandler(String name, int maxAmount) {
        super(name);
        this.maxAmount = maxAmount;
    }

    @Override
    public void processRequest(Request request) {
        if ("expense".equals(request.getType()) && request.getAmount() <= maxAmount) {
            System.out.println(approverName + " aprobó el gasto de $" + request.getAmount() +
                    " para " + request.getContent());
        } else {
            System.out.println(approverName + " no puede aprobar esta solicitud, pasándola al siguiente nivel...");
            passToNext(request);
        }
    }
}

// Manejador para solicitudes de permisos
class PermissionHandler extends ApproverBase {
    private List<String> allowedPermissions;

    public PermissionHandler(String name, String... permissions) {
        super(name);
        this.allowedPermissions = Arrays.asList(permissions);
    }

    @Override
    public void processRequest(Request request) {
        if ("permission".equals(request.getType()) && allowedPermissions.contains(request.getContent())) {
            System.out.println(approverName + " concedió el permiso para " + request.getContent());
        } else {
            System.out.println(approverName + " no puede aprobar esta solicitud, pasándola al siguiente nivel...");
            passToNext(request);
        }
    }
}

// Manejador para solicitudes de recursos
class ResourceHandler extends ApproverBase {
    private Predicate<Request> criteria;

    public ResourceHandler(String name, Predicate<Request> criteria) {
        super(name);
        this.criteria = criteria;
    }

    @Override
    public void processRequest(Request request) {
        if ("resource".equals(request.getType()) && criteria.test(request)) {
            System.out.println(approverName + " asignó el recurso: " + request.getContent());
        } else {
            System.out.println(approverName + " no puede aprobar esta solicitud, pasándola al siguiente nivel...");
            passToNext(request);
        }
    }
}

// Manejador para solicitudes que no se han procesado en la cadena
class FallbackHandler extends ApproverBase {
    public FallbackHandler(String name) {
        super(name);
    }

    @Override
    public void processRequest(Request request) {
        System.out.println(approverName + ": Solicitud escalada a revisión manual. Detalles: " + request);
    }
}

// Demostración del patrón Chain of Responsibility
public class ChainOfResponsibilityDemo {
    public static void main(String[] args) {
        // Crear los manejadores
        ExpenseHandler teamLead = new ExpenseHandler("Team Lead", 1000);
        ExpenseHandler manager = new ExpenseHandler("Manager", 5000);
        ExpenseHandler director = new ExpenseHandler("Director", 20000);
        
        PermissionHandler securityOfficer = new PermissionHandler("Security Officer", 
                "read files", "use printer");
        PermissionHandler itAdmin = new PermissionHandler("IT Admin", 
                "read files", "use printer", "install software", "network access");
        
        ResourceHandler resourceManager = new ResourceHandler("Resource Manager", 
                request -> request.getContent().startsWith("Room") || request.getContent().startsWith("Projector"));
        
        FallbackHandler fallback = new FallbackHandler("Sistema Fallback");
        
        // Configurar la cadena
        teamLead.setNext(manager);
        manager.setNext(director);
        director.setNext(securityOfficer);
        securityOfficer.setNext(itAdmin);
        itAdmin.setNext(resourceManager);
        resourceManager.setNext(fallback);
        
        // Procesar diferentes solicitudes
        Request[] requests = {
            new Request("expense", "Material de oficina", 800),
            new Request("expense", "Equipo de desarrollo", 3000),
            new Request("expense", "Servidor empresarial", 15000),
            new Request("expense", "Adquisición de empresa", 100000),
            new Request("permission", "use printer", 0),
            new Request("permission", "install software", 0),
            new Request("permission", "modify database", 0),
            new Request("resource", "Room A101", 1),
            new Request("resource", "Helicopter", 1)
        };
        
        for (Request request : requests) {
            System.out.println("\\nProcesando: " + request);
            teamLead.processRequest(request);
        }
    }
}`,
      explanation: [
        { line: 6, text: 'La clase Request representa la solicitud que pasará a través de la cadena.' },
        { line: 32, text: 'La interfaz Approver define los métodos que todos los manejadores deben implementar.' },
        { line: 38, text: 'ApproverBase es una clase abstracta base que proporciona funcionalidad común para los manejadores.' },
        { line: 50, text: 'El método passToNext pasa la solicitud al siguiente manejador o notifica si se ha llegado al final de la cadena.' },
        { line: 60, text: 'ExpenseHandler es un manejador especializado en aprobar solicitudes de gastos hasta cierto monto máximo.' },
        { line: 67, text: 'Si el manejador puede manejar la solicitud, la procesa, sino la pasa al siguiente.' },
        { line: 78, text: 'PermissionHandler maneja solicitudes de permisos específicos.' },
        { line: 95, text: 'ResourceHandler utiliza un Predicate para evaluar si puede asignar un recurso solicitado.' },
        { line: 111, text: 'FallbackHandler es un manejador de último recurso que procesa todas las solicitudes que llegan a él.' },
        { line: 123, text: 'La clase de demostración configura una cadena de responsabilidad con diferentes tipos de manejadores.' },
        { line: 125, text: 'Creamos manejadores para diferentes niveles de aprobación de gastos.' },
        { line: 129, text: 'Creamos manejadores para diferentes niveles de permisos.' },
        { line: 133, text: 'Creamos un manejador para recursos que usa un predicado para determinar si puede asignar un recurso.' },
        { line: 138, text: 'Configuramos la cadena conectando cada manejador con el siguiente.' },
        { line: 147, text: 'Creamos un conjunto de solicitudes variadas para probar la cadena.' },
        { line: 160, text: 'Procesamos cada solicitud a través de la cadena empezando por el primer manejador.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Estructura básica',
      cppTraditional: 'Usa clases y herencia con punteros crudos para encadenar manejadores, lo que requiere gestión manual de memoria.',
      cppModern: 'Utiliza smart pointers (shared_ptr) para administrar la memoria automáticamente y añade funcionalidades modernas como enums, structs y funciones lambda.',
      java: 'Emplea interfaces y clases abstractas, con una clara separación entre la interfaz común y la implementación base. Aprovecha características como predicados y arrays.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'El diseño simple hace fácil entender el patrón, pero cada manejador debe implementar toda la lógica de manejo y forwarding.',
      cppModern: 'Implementa una solución más robusta con una clase LoggerChain que simplifica la creación y uso de la cadena. Permite configuración flexible de niveles.',
      java: 'Proporciona manejadores especializados para diferentes tipos de solicitudes y utiliza predicados para definir criterios personalizables de manejo.'
    },
    {
      title: 'Caso de uso práctico',
      cppTraditional: 'Ejemplo abstracto que ilustra el concepto básico del patrón, enfocado en la estructura más que en la aplicación práctica.',
      cppModern: 'Implementado como un sistema de logs con diferentes destinos y niveles de severidad, mostrando un caso de uso común de este patrón.',
      java: 'Aplicado a un sistema de aprobaciones corporativas con diferentes tipos de solicitudes (gastos, permisos, recursos), demostrando su uso en un escenario empresarial.'
    }
  ],
  
  theory: {
    background: 'El patrón Chain of Responsibility fue formalizado por la Banda de los Cuatro (GoF) y se inspira en estructuras organizativas jerárquicas donde las solicitudes se elevan progresivamente en la cadena de mando hasta encontrar alguien que pueda manejarlas. Este patrón promueve el desacoplamiento al eliminar la dependencia directa entre el emisor de una solicitud y su receptor, representando una forma elegante de pasar solicitudes a través de una serie de manejadores potenciales. En sistemas complejos, permite que la responsabilidad se distribuya entre diferentes componentes, manteniendo cada componente enfocado en su área de competencia específica, mejorando así la modularidad y flexibilidad del sistema.',
    
    problem: 'En muchos sistemas, una solicitud debe ser procesada por varios objetos, pero no sabemos de antemano cuál objeto debe manejarla. Además, queremos evitar acoplar el emisor de la solicitud con todos sus posibles receptores. El uso de múltiples condicionales para determinar el manejador adecuado crea código rígido, difícil de mantener y extender cuando se añaden nuevos manejadores. A medida que el sistema crece, estas estructuras condicionales se vuelven más complejas y propensas a errores. Este problema es especialmente evidente en sistemas con lógica de procesamiento secuencial donde cada paso tiene criterios específicos para determinar si debe intervenir, como en sistemas de autorización, validación o transformación de datos.',
    
    solution: 'El patrón Chain of Responsibility crea una cadena de objetos receptores para una solicitud. Cada receptor contiene una referencia al siguiente receptor en la cadena. Al recibir una solicitud, cada manejador decide si la procesa o la pasa al siguiente en la cadena. Esto permite que múltiples objetos tengan la oportunidad de procesar la solicitud de forma independiente. La cadena puede configurarse dinámicamente en tiempo de ejecución, proporcionando mayor flexibilidad que las estructuras condicionales estáticas. La solución generalmente implica definir una interfaz de manejador común que especifica el método para procesar solicitudes y configurar la referencia al siguiente manejador, permitiendo así construir cadenas de cualquier longitud con diferentes tipos de manejadores especializados.',
    
    applicability: [
      'Cuando más de un objeto puede manejar una solicitud y el manejador no se conoce a priori',
      'Cuando quieres emitir una solicitud a uno de varios objetos sin especificar explícitamente el receptor',
      'Cuando el conjunto de objetos que pueden manejar una solicitud debe ser especificado dinámicamente',
      'Cuando quieres desacoplar el emisor de una solicitud de sus receptores',
      'Cuando tienes múltiples condiciones que deben ser evaluadas en un orden específico',
      'Cuando necesitas implementar filtros o procesadores secuenciales con diferentes responsabilidades',
      'Cuando quieres implementar un mecanismo de escalado jerárquico en sistemas organizativos',
      'Para crear pipelines de procesamiento donde cada etapa puede decidir continuar o detener el flujo',
      'En sistemas donde las solicitudes deben ser enriquecidas o transformadas progresivamente',
      'Para implementar middleware en aplicaciones web o APIs',
      'Cuando necesitas un mecanismo para manejar excepciones en diferentes niveles de abstracción'
    ],
    
    consequences: [
      'Reduce el acoplamiento entre el emisor de una solicitud y sus receptores',
      'Proporciona flexibilidad para asignar responsabilidades a objetos: puedes añadir o cambiar responsabilidades reconfigurando la cadena',
      'Permite que diferentes objetos manejen solicitudes según sus capacidades, promoviendo el principio de responsabilidad única',
      'Facilita la adición de nuevos manejadores sin modificar el código existente, respetando el principio abierto/cerrado',
      'No garantiza que una solicitud sea manejada; puede "caer" al final de la cadena sin ser procesada si no se implementa un manejador por defecto',
      'Puede ser difícil seguir y depurar el flujo de una solicitud a través de la cadena',
      'Puede crear latencia si la cadena es larga y cada objeto necesita evaluar extensivamente la solicitud',
      'Puede llevar a redundancia en el código de cada manejador si no se diseña correctamente con abstracciones adecuadas',
      'Puede mejorar la modularidad al permitir que componentes se enfoquen en procesar solo lo que saben manejar',
      'El orden de los manejadores puede ser crítico para el correcto funcionamiento del sistema',
      'Proporciona mayor flexibilidad que las estructuras condicionales para manejar comportamientos complejos',
      'Puede incrementar el consumo de memoria al requerir múltiples objetos manejadores'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Chain of Responsibility?</h3>
      <ul>
        <li><strong>Sistemas de manejo de eventos:</strong> Cuando necesitas procesar eventos a través de múltiples manejadores en una secuencia predefinida, como en frameworks de UI donde eventos de click pueden ser manejados por diferentes componentes.</li>
        <li><strong>Procesamiento secuencial:</strong> Para implementar filtros o procesadores secuenciales donde cada paso puede rechazar, modificar o aprobar la entrada, como en pipelines de procesamiento de datos.</li>
        <li><strong>Niveles de autoridad:</strong> Cuando implementas sistemas donde las decisiones deben escalarse a niveles superiores si no pueden resolverse en niveles inferiores, como en sistemas de aprobación de gastos corporativos.</li>
        <li><strong>Middleware:</strong> Para implementar middleware en aplicaciones web, donde cada componente procesa aspectos específicos de una solicitud HTTP (autenticación, logging, compresión, etc).</li>
        <li><strong>Validación en múltiples etapas:</strong> Para validar entrada de usuario en diferentes niveles (formato, lógica de negocio, seguridad), donde cada validador puede rechazar la entrada por diferentes razones.</li>
        <li><strong>Sistemas de logging:</strong> Donde diferentes loggers procesan mensajes según su nivel de severidad y destino (consola, archivo, base de datos, email).</li>
        <li><strong>Flujos de trabajo:</strong> Para modelar procesos de negocio con múltiples pasos, donde cada paso puede aprobar, rechazar o modificar la solicitud antes de pasar al siguiente.</li>
        <li><strong>Sistemas de filtrado:</strong> En aplicaciones que requieren filtrar contenido a través de múltiples reglas o criterios, como filtros de spam o sistemas de moderación de contenido.</li>
        <li><strong>Manejo de excepciones:</strong> Para implementar mecanismos de recuperación de errores en diferentes niveles, donde cada manejador intenta resolver un tipo específico de excepción.</li>
        <li><strong>Conversiones de formato:</strong> En procesadores de documentos donde diferentes componentes manejan diferentes formatos o elementos del documento.</li>
      </ul>
      
      <h3>Variantes del patrón Chain of Responsibility:</h3>
      <ul>
        <li><strong>Cadena con delegación completa:</strong> Donde cada manejador decide si pasa la solicitud al siguiente, dando control total a cada eslabón sobre la propagación.</li>
        <li><strong>Cadena con procesamiento múltiple:</strong> Donde una solicitud puede ser manejada por múltiples objetos en la cadena, no solo por el primero que puede hacerlo, permitiendo que cada manejador aporte algo al procesamiento.</li>
        <li><strong>Cadena con respuesta:</strong> Donde cada manejador puede devolver una respuesta que se acumula o modifica a lo largo de la cadena, formando una respuesta compuesta.</li>
        <li><strong>Cadena dinámica:</strong> Donde la estructura de la cadena puede modificarse en tiempo de ejecución según condiciones específicas, como la carga del sistema o preferencias del usuario.</li>
        <li><strong>Cadena con prioridades:</strong> Donde los manejadores tienen diferentes prioridades y pueden reorganizarse automáticamente para optimizar el procesamiento.</li>
        <li><strong>Cadena combinada con Command:</strong> Donde los comandos se procesan a través de una cadena de manejadores que pueden transformarlos o enriquecerlos antes de su ejecución.</li>
        <li><strong>Cadena bidireccional:</strong> Donde la solicitud puede viajar tanto hacia adelante como hacia atrás en la cadena, permitiendo revisiones o validaciones adicionales.</li>
        <li><strong>Cadena circular:</strong> Donde el último manejador puede devolver la solicitud al primero, creando un ciclo de procesamiento para solicitudes que requieren múltiples pasadas.</li>
        <li><strong>Cadena con contexto compartido:</strong> Donde todos los manejadores operan sobre un contexto compartido que se enriquece progresivamente a lo largo de la cadena.</li>
        <li><strong>Cadena con intercepción:</strong> Donde los manejadores pueden modificar tanto la solicitud que pasa hacia adelante como la respuesta que vuelve hacia atrás, útil en sistemas de interceptores.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Frameworks web:</strong> Middleware en Express.js, ASP.NET o Django, donde cada componente procesa una solicitud HTTP y decide si continuar la cadena. Por ejemplo, en Express.js:</li>
        <pre>
app.use(authentication);
app.use(logging);
app.use(compression);
app.get('/api', handler);
        </pre>
        <li><strong>Sistemas de logging:</strong> Como log4j o Winston, donde los mensajes de registro se procesan a través de múltiples appenders y filtros basados en su nivel de severidad.</li>
        <li><strong>Procesamiento de imágenes:</strong> Filtros y transformaciones aplicados secuencialmente a una imagen, como en bibliotecas de procesamiento donde cada filtro puede modificar la imagen original.</li>
        <li><strong>Validación de formularios:</strong> Donde múltiples validadores comprueban diferentes aspectos de la entrada del usuario (longitud, formato, restricciones de negocio).</li>
        <li><strong>Flujos de aprobación:</strong> En sistemas empresariales como SAP o Workday, donde las solicitudes se envían a través de múltiples niveles de aprobación basados en montos o categorías.</li>
        <li><strong>Sistemas de ayuda contextual:</strong> En interfaces de usuario donde las solicitudes de ayuda se dirigen al componente más específico que puede proporcionar asistencia relevante.</li>
        <li><strong>Filtros de seguridad:</strong> En aplicaciones para filtrar contenido malicioso o no autorizado a través de múltiples niveles de inspección (antivirus, firewall, filtros de contenido).</li>
        <li><strong>Frameworks de procesamiento ETL:</strong> Donde los datos pasan por múltiples etapas de extracción, transformación y carga, cada una manejada por componentes específicos:
        <pre>
// Pseudocódigo de un pipeline ETL con Chain of Responsibility
class ETLPipeline {
  constructor() {
    this.firstHandler = null;
    this.lastHandler = null;
  }
  
  addHandler(handler) {
    if (!this.firstHandler) {
      this.firstHandler = handler;
      this.lastHandler = handler;
    } else {
      this.lastHandler.setNext(handler);
      this.lastHandler = handler;
    }
    return this;
  }
  
  process(data) {
    if (this.firstHandler) {
      return this.firstHandler.handle(data);
    }
    return data;
  }
}

class DataExtractor {
  constructor(source) {
    this.source = source;
    this.next = null;
  }
  
  setNext(handler) {
    this.next = handler;
  }
  
  handle(request) {
    console.log("Extrayendo datos de " + this.source);
    // Lógica de extracción
    const extractedData = Object.assign({}, request, {extracted: true});
    
    return this.next ? this.next.handle(extractedData) : extractedData;
  }
}

class DataTransformer {
  constructor(transformation) {
    this.transformation = transformation;
    this.next = null;
  }
  
  setNext(handler) {
    this.next = handler;
  }
  
  handle(data) {
    console.log("Aplicando transformación: " + this.transformation);
    // Lógica de transformación
    const transformedData = Object.assign({}, data, {transformed: true});
    
    return this.next ? this.next.handle(transformedData) : transformedData;
  }
}

class DataLoader {
  constructor(destination) {
    this.destination = destination;
    this.next = null;
  }
  
  setNext(handler) {
    this.next = handler;
  }
  
  handle(data) {
    console.log("Cargando datos en " + this.destination);
    // Lógica de carga
    const loadedResult = Object.assign({}, data, {loaded: true});
    
    return this.next ? this.next.handle(loadedResult) : loadedResult;
  }
}

// Uso
const pipeline = new ETLPipeline();
pipeline
  .addHandler(new DataExtractor("API"))
  .addHandler(new DataTransformer("normalización"))
  .addHandler(new DataTransformer("enriquecimiento"))
  .addHandler(new DataLoader("data warehouse"));

const result = pipeline.process({id: 1, raw: true});
        </pre>
        </li>
        <li><strong>Sistemas de eventos en aplicaciones móviles:</strong> Donde los gestos del usuario se procesan a través de una cadena de reconocedores de gestos, desde los más específicos a los más generales.</li>
        <li><strong>Procesamiento de pagos:</strong> Donde una transacción pasa por verificación de fondos, anti-fraude, conversión de moneda y autorización final, cada uno manejado por componentes especializados que pueden aprobar o rechazar la transacción.</li>
      </ul>
      
      <h3>Implementación efectiva del patrón Chain of Responsibility:</h3>
      <ul>
        <li><strong>Diseño de la interfaz de manejador:</strong> Asegúrate de que la interfaz del manejador sea clara y cohesiva, incluyendo métodos para manejar la solicitud y configurar el siguiente manejador.</li>
        <li><strong>Implementa un manejador por defecto:</strong> Considera añadir un manejador al final de la cadena que procese cualquier solicitud no manejada por los anteriores, evitando que las solicitudes "caigan" sin ser procesadas.</li>
        <li><strong>Considera el orden de los manejadores:</strong> El orden en que se configuran los manejadores puede ser crítico para el correcto funcionamiento; ordénalos desde los más específicos a los más generales.</li>
        <li><strong>Optimiza el rendimiento:</strong> Si la cadena es larga, considera implementar optimizaciones como "fast-paths" para solicitudes comunes o cachés para evitar evaluaciones repetitivas.</li>
        <li><strong>Mantén la inmutabilidad:</strong> Considera hacer que las solicitudes sean inmutables para evitar efectos secundarios difíciles de rastrear, o implementa un mecanismo claro para gestionar los cambios en la solicitud.</li>
        <li><strong>Proporciona mecanismos de depuración:</strong> Implementa logging o trazabilidad para seguir cómo una solicitud se propaga a través de la cadena, facilitando la depuración.</li>
        <li><strong>Gestiona los recursos adecuadamente:</strong> Si los manejadores consumen recursos significativos, considera implementar un pool de manejadores o estrategias de lazy loading.</li>
        <li><strong>Considera la concurrencia:</strong> Si la cadena se utiliza en entornos concurrentes, asegúrate de que los manejadores sean thread-safe o implementa sincronización adecuada.</li>
        <li><strong>Diseña para la extensibilidad:</strong> Facilita la adición de nuevos manejadores sin modificar los existentes, siguiendo el principio abierto/cerrado.</li>
        <li><strong>Utiliza un builder para la cadena:</strong> Considera implementar un builder para construir la cadena de forma fluida y legible, como se muestra en el ejemplo ETL anterior.</li>
      </ul>
      
      <h3>Chain of Responsibility vs Command vs Mediator vs Decorator</h3>
      <ul>
        <li><strong>Chain of Responsibility:</strong> Se centra en pasar una solicitud a lo largo de una cadena de manejadores hasta que uno la procese, descentralizando la toma de decisiones. Se enfoca en "quién" procesa la solicitud.</li>
        <li><strong>Command:</strong> Encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, pero no establece una cadena de procesamiento secuencial. Se enfoca en "qué" operación se realiza.</li>
        <li><strong>Mediator:</strong> Centraliza la comunicación entre objetos a través de un mediador, mientras que Chain of Responsibility descentraliza el procesamiento a través de una serie de manejadores independientes. Mediator conoce a todos los participantes, mientras que en Chain of Responsibility cada manejador solo conoce al siguiente.</li>
        <li><strong>Decorator:</strong> Similar a Chain of Responsibility en que envuelve objetos en una cadena, pero se centra en añadir responsabilidades a objetos sin cambiar su interfaz, mientras que Chain of Responsibility se enfoca en determinar qué objeto en una cadena debería manejar una solicitud. En Decorator, todas las solicitudes pasan por toda la cadena; en Chain of Responsibility, la cadena puede detenerse cuando un manejador procesa la solicitud.</li>
        <li><strong>Observer:</strong> Mientras Chain of Responsibility crea una cadena lineal de manejadores, Observer establece relaciones uno-a-muchos donde todos los observadores son notificados de un cambio. La diferencia clave es que en Chain of Responsibility, solo un manejador típicamente procesa la solicitud; en Observer, todos los observadores registrados reciben la notificación.</li>
      </ul>
    `
  },
  
  notes: 'El patrón Chain of Responsibility es fundamental en muchos frameworks modernos, especialmente en sistemas web donde el concepto de middleware ha ganado popularidad. Es particularmente útil cuando necesitas desacoplar el emisor de una solicitud de sus receptores potenciales y cuando quieres proporcionar múltiples objetos con la oportunidad de manejar una solicitud. Cuando lo implementes, considera añadir un manejador por defecto al final de la cadena para asegurar que todas las solicitudes sean manejadas de alguna manera, evitando que "caigan" sin ser procesadas. También es importante considerar el rendimiento si la cadena es larga o las operaciones de procesamiento son costosas. En algunos casos, puede ser beneficioso combinar Chain of Responsibility con otros patrones como Command (para encapsular solicitudes) o Observer (para notificar sobre el procesamiento de solicitudes a componentes interesados).'
};

export default chainOfResponsibilityPattern;
