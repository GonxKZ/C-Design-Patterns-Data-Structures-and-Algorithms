const chainOfResponsibilityPattern = {
  id: 'chain-of-responsibility',
  name: 'Chain of Responsibility',
  category: 'behavioral',
  description: 'El patrón Chain of Responsibility permite pasar solicitudes a lo largo de una cadena de manejadores, evitando acoplar el emisor de una petición a su receptor al dar a más de un objeto la oportunidad de manejar la petición.',
  
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
    background: 'El patrón Chain of Responsibility es uno de los 23 patrones de diseño del Gang of Four. Se clasifica como un patrón de comportamiento porque trata con la asignación de responsabilidades entre objetos y con algoritmos y la comunicación entre ellos.',
    problem: 'A menudo, más de un objeto puede manejar una solicitud, y el emisor de la solicitud no sabe exactamente qué objeto debe procesarla. Además, el conjunto de objetos que pueden manejar la solicitud puede cambiar dinámicamente. Se necesita una forma de desacoplar el emisor de la solicitud de los receptores y dar a varios objetos la oportunidad de manejar la solicitud.',
    solution: 'El patrón Chain of Responsibility sugiere organizar los manejadores en una cadena donde cada manejador tiene una referencia al siguiente. Cada manejador decide si procesa la solicitud o la pasa al siguiente manejador en la cadena. La solicitud viaja a lo largo de la cadena hasta que algún manejador la procesa o hasta que llega al final de la cadena sin ser procesada.',
    applicability: [
      'Cuando más de un objeto puede manejar una solicitud, pero el manejador no se conoce a priori.',
      'Cuando se quiere emitir una solicitud a uno de varios objetos sin especificar explícitamente el receptor.',
      'Cuando el conjunto de objetos que pueden manejar una solicitud debe ser especificado dinámicamente.',
      'Para implementar un mecanismo de manejo de eventos o solicitudes en capas, donde cada capa tiene diferentes responsabilidades.',
      'Para implementar sistemas de procesamiento secuencial donde cada paso puede decidir procesar o pasar la solicitud.'
    ],
    benefits: [
      'Reduce el acoplamiento al evitar que el emisor y el receptor se conozcan directamente.',
      'Permite añadir o quitar responsabilidades dinámicamente cambiando los manejadores en la cadena.',
      'Cada manejador puede concentrarse en una sola responsabilidad específica.',
      'Implementa el principio de responsabilidad única y el principio abierto/cerrado.',
      'Proporciona flexibilidad en la distribución de responsabilidades entre objetos.'
    ],
    drawbacks: [
      'No hay garantía de que una solicitud sea manejada; podría llegar al final de la cadena sin ser procesada.',
      'Puede ser difícil de depurar si la cadena no está bien diseñada o documentada.',
      'Puede introducir sobrecarga de procesamiento si la cadena es muy larga.',
      'Potencial redundancia de código si los manejadores comparten lógica similar.',
      'La configuración incorrecta de la cadena puede llevar a comportamientos inesperados o bucles infinitos.'
    ]
  }
};

export default chainOfResponsibilityPattern;
