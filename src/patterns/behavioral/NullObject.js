const nullObjectPattern = {
  id: 'null-object',
  name: 'Null Object',
  category: 'behavioral',
  description: 'Proporciona un objeto sustituto que no hace nada para reemplazar la comprobación explícita de nulos.',
  
  theory: {
    background: 'En sistemas orientados a objetos, las referencias nulas (null/nullptr) pueden causar errores en tiempo de ejecución cuando se intenta invocar métodos en ellas. El patrón Null Object ofrece una alternativa segura.',
    problem: 'La comprobación constante de referencias nulas contamina el código con verificaciones condicionales y dificulta la lectura y el mantenimiento.',
    solution: 'Crear una implementación especial del objeto que no hace nada (comportamiento neutral) y utilizarla en lugar de una referencia nula.',
    applicability: [
      "Cuando quieres evitar verificaciones nulas explícitas repetidas",
      "Cuando un objeto puede estar ausente pero el código cliente no debería tener que preocuparse por ello",
      "Cuando necesitas proporcionar un comportamiento por defecto para objetos ausentes",
      "Cuando quieres simplificar el código cliente eliminando condicionales"
    ],
    consequences: [
      "Simplifica el código cliente eliminando comprobaciones condicionales de nulos",
      "Código más limpio, legible y fácil de mantener",
      "Mayor seguridad, evitando errores de referencia nula en tiempo de ejecución",
      "Puede ocultar errores si no se detecta la ausencia de un objeto",
      "Puede aumentar ligeramente el número de objetos en el sistema"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <memory>

// Interfaz para Logger
class Logger {
public:
    virtual ~Logger() {}
    virtual void log(const std::string& message) = 0;
    virtual bool isNull() const = 0;
};

// Implementación concreta de Logger
class ConsoleLogger : public Logger {
public:
    void log(const std::string& message) override {
        std::cout << "Registrando: " << message << std::endl;
    }
    
    bool isNull() const override {
        return false;
    }
};

// Implementación de Null Object para Logger
class NullLogger : public Logger {
public:
    // No hace nada cuando se llama a log
    void log(const std::string& message) override {
        // Intencionalmente vacío
    }
    
    bool isNull() const override {
        return true;
    }
};

// Clase que usa Logger
class Service {
private:
    Logger* logger;
    
public:
    Service(Logger* logger) : logger(logger) {
        if (logger == nullptr) {
            this->logger = new NullLogger();
        }
    }
    
    ~Service() {
        if (logger && logger->isNull()) {
            delete logger;
        }
    }
    
    void doSomething() {
        // Operación de ejemplo
        logger->log("Service está realizando una operación");
        
        // No necesitamos verificar si logger es nullptr
        // Siempre es seguro llamar a los métodos de logger
    }
};

// Función para obtener un logger basado en configuración externa
Logger* getConfiguredLogger(bool hasLogger) {
    if (hasLogger) {
        return new ConsoleLogger();
    } else {
        return new NullLogger();
    }
}

// Cliente
int main() {
    // Enfoque sin Null Object - Requiere comprobaciones nulas
    Logger* loggerA = nullptr;
    if (false /* alguna condición externa */) {
        loggerA = new ConsoleLogger();
    }
    
    // Uso sin Null Object
    if (loggerA != nullptr) {
        loggerA->log("Este mensaje solo se registra si loggerA existe");
    } else {
        std::cout << "No se pudo registrar el mensaje (loggerA es nulo)" << std::endl;
    }
    
    // Enfoque con Null Object - Sin comprobaciones nulas
    Logger* loggerB = getConfiguredLogger(false);
    
    // Uso con Null Object - Siempre seguro
    loggerB->log("Este mensaje será ignorado por NullLogger");
    
    // Uso en una clase de servicio
    Service serviceWithLogger(new ConsoleLogger());
    serviceWithLogger.doSomething();
    
    Service serviceWithoutLogger(nullptr); // Usará NullLogger internamente
    serviceWithoutLogger.doSomething();
    
    // Limpieza
    delete loggerB;
    if (loggerA) delete loggerA;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras estándar necesarias.' },
        { line: 5, text: 'Definimos una interfaz abstracta Logger con los métodos requeridos.' },
        { line: 7, text: 'Destructor virtual para asegurar la correcta liberación de memoria en la jerarquía de clases.' },
        { line: 8, text: 'Método virtual puro log() que todas las clases concretas deben implementar.' },
        { line: 9, text: 'Método isNull() para identificar si el objeto es un objeto nulo.' },
        { line: 13, text: 'ConsoleLogger es una implementación concreta que escribe mensajes en la consola.' },
        { line: 14, text: 'Implementa log() para mostrar mensajes en la consola.' },
        { line: 18, text: 'Implementa isNull() para indicar que no es un objeto nulo.' },
        { line: 23, text: 'NullLogger es la implementación del objeto nulo para Logger.' },
        { line: 25, text: 'Implementa log() para no hacer nada (comportamiento neutral).' },
        { line: 29, text: 'Implementa isNull() para identificarse como un objeto nulo.' },
        { line: 34, text: 'Service es una clase que utiliza Logger.' },
        { line: 38, text: 'Constructor que acepta un Logger, reemplazándolo con NullLogger si es nulo.' },
        { line: 44, text: 'En el destructor, solo eliminamos el logger si creamos un NullLogger interno.' },
        { line: 49, text: 'Método que usa Logger sin preocuparse por referencias nulas.' },
        { line: 57, text: 'Función auxiliar que proporciona un Logger configurado o un NullLogger.' },
        { line: 66, text: 'Código cliente que demuestra diferentes enfoques.' },
        { line: 67, text: 'Enfoque sin Null Object: inicializamos un puntero a nulo.' },
        { line: 73, text: 'Sin Null Object, debemos comprobar explícitamente si el puntero es nulo.' },
        { line: 79, text: 'Enfoque con Null Object: obtenemos un logger configurado (en este caso NullLogger).' },
        { line: 82, text: 'Con Null Object, podemos llamar a log() de forma segura sin comprobaciones.' },
        { line: 85, text: 'Creamos un Service con un logger concreto.' },
        { line: 88, text: 'Creamos un Service sin logger, que utilizará un NullLogger internamente.' },
        { line: 91, text: 'Limpiamos la memoria manualmente, necesario en C++ tradicional.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <utility>

// Interfaz para Logger
class Logger {
public:
    virtual ~Logger() = default;
    virtual void log(const std::string& message) = 0;
    virtual bool isNull() const = 0;
    
    // Método estático para crear un logger o un objeto nulo
    static std::shared_ptr<Logger> create(bool hasLogger);
};

// Implementación concreta de Logger
class ConsoleLogger : public Logger {
public:
    void log(const std::string& message) override {
        std::cout << "Registrando: " << message << std::endl;
    }
    
    bool isNull() const override {
        return false;
    }
};

// Implementación de Null Object para Logger
class NullLogger : public Logger {
public:
    // Singleton para el NullLogger
    static std::shared_ptr<NullLogger> instance() {
        static std::shared_ptr<NullLogger> instance = std::make_shared<NullLogger>();
        return instance;
    }
    
    void log(const std::string& message) override {
        // Intencionalmente vacío
    }
    
    bool isNull() const override {
        return true;
    }
    
private:
    // Constructor privado para implementar el patrón Singleton
    NullLogger() = default;
};

// Implementación del método estático de factoría
std::shared_ptr<Logger> Logger::create(bool hasLogger) {
    if (hasLogger) {
        return std::make_shared<ConsoleLogger>();
    } else {
        return NullLogger::instance();
    }
}

// Clase que usa Logger
class Service {
private:
    std::shared_ptr<Logger> logger;
    
public:
    explicit Service(std::shared_ptr<Logger> logger) 
        : logger(logger ? std::move(logger) : NullLogger::instance()) {}
    
    void doSomething() {
        // Operación de ejemplo
        logger->log("Service está realizando una operación");
        
        // No necesitamos verificar si logger es nullptr
        // Siempre es seguro llamar a los métodos de logger
    }
};

// Cliente
int main() {
    // Enfoque moderno con smart pointers y factory method
    auto consoleLogger = Logger::create(true);
    auto nullLogger = Logger::create(false);
    
    // Uso seguro sin comprobaciones
    consoleLogger->log("Este mensaje se registra en la consola");
    nullLogger->log("Este mensaje será ignorado silenciosamente");
    
    // Uso de operador ternario con objeto nulo
    bool enableLogging = false;
    auto configuredLogger = enableLogging ? 
        std::make_shared<ConsoleLogger>() : NullLogger::instance();
    
    configuredLogger->log("Este mensaje depende de la configuración");
    
    // Uso en una clase de servicio
    Service serviceWithLogger(std::make_shared<ConsoleLogger>());
    serviceWithLogger.doSomething();
    
    Service serviceWithoutLogger(nullptr); // Usará NullLogger internamente
    serviceWithoutLogger.doSomething();
    
    // Sin necesidad de limpieza manual - los shared_ptr se encargan de ello
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos cabeceras estándar, incluyendo <memory> para smart pointers.' },
        { line: 6, text: 'Definimos la interfaz Logger con métodos virtuales.' },
        { line: 8, text: 'Destructor virtual con sintaxis "= default" de C++11.' },
        { line: 12, text: 'Método estático de factoría para crear loggers o null loggers.' },
        { line: 16, text: 'ConsoleLogger es una implementación concreta que registra en la consola.' },
        { line: 26, text: 'NullLogger es la implementación del patrón Null Object.' },
        { line: 28, text: 'Implementamos NullLogger como un Singleton usando shared_ptr.' },
        { line: 29, text: 'Usamos una variable estática con std::make_shared para crear la instancia única.' },
        { line: 40, text: 'Constructor privado para asegurar que solo se crea a través del método instance().' },
        { line: 45, text: 'Implementación del método estático create que actúa como factoría.' },
        { line: 53, text: 'Service es una clase que utiliza un Logger a través de smart pointer.' },
        { line: 57, text: 'Constructor con std::move y operador ternario para asignar NullLogger si logger es nullptr.' },
        { line: 66, text: 'Cliente que demuestra el uso del patrón Null Object con C++ moderno.' },
        { line: 68, text: 'Usamos el método de factoría para crear loggers concretos o nulos.' },
        { line: 71, text: 'Podemos usar ambos logger sin comprobaciones nulas, aumentando la legibilidad.' },
        { line: 75, text: 'Uso de operador ternario con NullLogger::instance() para código más limpio.' },
        { line: 81, text: 'Creación de Service con un logger concreto usando std::make_shared.' },
        { line: 84, text: 'Creación de Service sin logger, que utilizará NullLogger internamente.' },
        { line: 87, text: 'No necesitamos limpieza manual gracias a los smart pointers.' }
      ]
    },
    java: {
      code: `import java.util.Optional;

// Interfaz para Logger
interface Logger {
    void log(String message);
    boolean isNull();
    
    // Método estático de factoría
    static Logger getInstance(boolean hasLogger) {
        return hasLogger ? new ConsoleLogger() : NullLogger.getInstance();
    }
}

// Implementación concreta de Logger
class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("Registrando: " + message);
    }
    
    @Override
    public boolean isNull() {
        return false;
    }
}

// Implementación de Null Object para Logger
class NullLogger implements Logger {
    // Singleton para el NullLogger
    private static final NullLogger INSTANCE = new NullLogger();
    
    private NullLogger() {
        // Constructor privado para Singleton
    }
    
    public static NullLogger getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void log(String message) {
        // Intencionalmente vacío - no hace nada
    }
    
    @Override
    public boolean isNull() {
        return true;
    }
}

// Clase que usa Logger
class Service {
    private final Logger logger;
    
    public Service(Logger logger) {
        // Si logger es null, usamos NullLogger
        this.logger = logger != null ? logger : NullLogger.getInstance();
    }
    
    public void doSomething() {
        // Operación de ejemplo
        logger.log("Service está realizando una operación");
        
        // No necesitamos verificar si logger es null
        // Siempre es seguro llamar a los métodos de logger
    }
}

// Demostración con Optional en Java 8+
class OptionalDemo {
    private final Optional<Logger> optionalLogger;
    
    public OptionalDemo(Optional<Logger> logger) {
        this.optionalLogger = logger;
    }
    
    public void doSomething() {
        // Usando Optional con orElse para proporcionar un NullLogger si es necesario
        Logger logger = optionalLogger.orElse(NullLogger.getInstance());
        logger.log("OptionalDemo está realizando una operación");
    }
}

// Cliente principal
public class NullObjectDemo {
    public static void main(String[] args) {
        // Enfoque sin Null Object - Requiere comprobaciones null
        Logger loggerA = null;
        if (false /* alguna condición externa */) {
            loggerA = new ConsoleLogger();
        }
        
        // Uso sin Null Object
        if (loggerA != null) {
            loggerA.log("Este mensaje solo se registra si loggerA existe");
        } else {
            System.out.println("No se pudo registrar el mensaje (loggerA es null)");
        }
        
        // Enfoque con Null Object - Sin comprobaciones null
        Logger loggerB = Logger.getInstance(false);
        
        // Uso con Null Object - Siempre seguro
        loggerB.log("Este mensaje será ignorado por NullLogger");
        
        // Uso en una clase de servicio
        Service serviceWithLogger = new Service(new ConsoleLogger());
        serviceWithLogger.doSomething();
        
        Service serviceWithoutLogger = new Service(null); // Usará NullLogger internamente
        serviceWithoutLogger.doSomething();
        
        // Demostración con Optional de Java 8+
        OptionalDemo demoWithLogger = new OptionalDemo(Optional.of(new ConsoleLogger()));
        demoWithLogger.doSomething();
        
        OptionalDemo demoWithoutLogger = new OptionalDemo(Optional.empty());
        demoWithoutLogger.doSomething();
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos Optional de Java 8 para mostrar un enfoque alternativo.' },
        { line: 4, text: 'Definimos la interfaz Logger con los métodos necesarios.' },
        { line: 5, text: 'Método para registrar mensajes.' },
        { line: 6, text: 'Método para verificar si es un objeto nulo.' },
        { line: 9, text: 'Método estático de factoría para crear loggers o null loggers.' },
        { line: 14, text: 'ConsoleLogger es una implementación concreta que registra en la consola.' },
        { line: 16, text: 'Implementa log() para mostrar mensajes en la consola.' },
        { line: 24, text: 'NullLogger es la implementación del patrón Null Object.' },
        { line: 26, text: 'Implementamos NullLogger como un Singleton en Java.' },
        { line: 28, text: 'Constructor privado para asegurar que solo se crea a través del método getInstance().' },
        { line: 32, text: 'Método estático para obtener la instancia única de NullLogger.' },
        { line: 37, text: 'Implementación vacía de log() para no hacer nada.' },
        { line: 46, text: 'Service es una clase que utiliza Logger.' },
        { line: 50, text: 'Constructor que asigna NullLogger si el logger proporcionado es null.' },
        { line: 54, text: 'Método que usa Logger sin preocuparse por referencias null.' },
        { line: 63, text: 'OptionalDemo muestra cómo usar Java 8 Optional como alternativa al patrón Null Object.' },
        { line: 66, text: 'Constructor que acepta un Optional<Logger> en lugar de un Logger.' },
        { line: 71, text: 'Usamos orElse para proporcionar un NullLogger si Optional está vacío.' },
        { line: 78, text: 'Clase principal con método main para demostrar los diferentes enfoques.' },
        { line: 80, text: 'Enfoque sin Null Object: declaramos una variable como null.' },
        { line: 86, text: 'Sin Null Object, necesitamos comprobar explícitamente si es null.' },
        { line: 93, text: 'Enfoque con Null Object: obtenemos un logger configurado (en este caso NullLogger).' },
        { line: 96, text: 'Con Null Object, podemos llamar a log() de forma segura sin comprobaciones.' },
        { line: 99, text: 'Creamos un Service con un logger concreto.' },
        { line: 102, text: 'Creamos un Service sin logger, que utilizará NullLogger internamente.' },
        { line: 105, text: 'Demostramos el uso de Optional como alternativa moderna en Java 8+.' },
        { line: 108, text: 'Creamos un OptionalDemo sin logger (Optional vacío).' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de nulos',
      cppTraditional: 'Requiere verificación explícita o reemplazo manual de punteros nulos por objetos NullObject.',
      cppModern: 'Usa smart pointers y operador ternario para una gestión más segura, junto con un Singleton para el NullObject.',
      java: 'Proporciona verificación explícita y puede aprovechar Optional<T> de Java 8 como alternativa moderna.'
    },
    {
      title: 'Seguridad de tipos',
      cppTraditional: 'Propenso a errores al trabajar con punteros crudos, requiere gestión manual de memoria.',
      cppModern: 'Uso de shared_ptr para evitar fugas de memoria y proporcionar mayor seguridad de tipos.',
      java: 'Seguridad de tipos inherente debido al sistema de tipos de Java y la gestión automática de memoria.'
    },
    {
      title: 'Creación de instancias',
      cppTraditional: 'Creación de instancias mediante new, lo que requiere delete manual.',
      cppModern: 'Uso de std::make_shared para crear instancias de manera segura y eficiente.',
      java: 'Construcción de instancias mediante new, con limpieza automática por el recolector de basura.'
    },
    {
      title: 'Enfoques alternativos',
      cppTraditional: 'Generalmente limitado al patrón Null Object clásico.',
      cppModern: 'Puede combinar Null Object con otros patrones modernos como el método de fábrica estático.',
      java: 'Ofrece Optional<T> de Java 8 como alternativa incorporada al patrón Null Object tradicional.'
    }
  ],
  
  notes: 'El patrón Null Object es particularmente útil en sistemas donde la ausencia de un objeto no debe considerarse un error, sino un caso especial con comportamiento predefinido. A menudo se combina con el patrón Singleton para el objeto nulo, ya que generalmente solo se necesita una instancia del objeto nulo. En lenguajes modernos, existen alternativas como Optional en Java o std::optional en C++17 que pueden complementar este patrón. El patrón simplifica el código cliente al eliminar comprobaciones nulas repetitivas, pero debe usarse con cuidado para no ocultar errores reales que deberían ser manejados explícitamente.'
};

export default nullObjectPattern; 