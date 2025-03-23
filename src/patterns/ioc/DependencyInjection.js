const dependencyInjectionPattern = {
  id: 'dependency-injection',
  name: 'Dependency Injection',
  category: 'ioc',
  description: 'Proporciona objetos a una clase en lugar de que la clase los cree. Es una forma específica de inversión de control donde se invierte la responsabilidad de cómo un objeto obtiene referencias a los objetos con los que colabora.',
  
  theory: {
    background: 'La inyección de dependencias surgió como una técnica específica dentro del principio más amplio de Inversión de Control (IoC). Fue popularizada por frameworks como Spring en Java, que la implementaron como un mecanismo central de configuración de componentes.',
    problem: 'Las clases tradicionales crean sus dependencias internamente, lo que genera un acoplamiento fuerte. Esto dificulta el cambio de implementaciones, el testing unitario y la reutilización de componentes.',
    solution: 'En lugar de que una clase cree o busque sus dependencias, éstas son proporcionadas ("inyectadas") por una entidad externa. La inyección puede ocurrir por constructor, por setter o por interfaz.',
    applicability: [
      'Cuando una clase tiene dependencias que requieren configuración externa',
      'Para lograr desacoplamiento entre componentes',
      'Para facilitar pruebas unitarias mediante el uso de mocks',
      'Cuando se desea cambiar implementaciones sin modificar el código cliente',
      'En aplicaciones complejas donde la construcción de objetos y sus dependencias debe ser gestionada de forma centralizada'
    ],
    consequences: [
      'Reduce el acoplamiento entre clases',
      'Mejora la testabilidad del código',
      'Aumenta la modularidad y reutilización',
      'Puede introducir complejidad adicional en aplicaciones simples',
      'Puede dificultar el seguimiento del flujo de ejecución'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `// Interfaces para servicios
class Logger {
public:
    virtual ~Logger() {}
    virtual void logInfo(const std::string& message) = 0;
    virtual void logError(const std::string& message) = 0;
};

class Database {
public:
    virtual ~Database() {}
    virtual bool saveData(const std::string& key, const std::string& value) = 0;
    virtual std::string fetchData(const std::string& key) = 0;
};

// Implementaciones concretas
class ConsoleLogger : public Logger {
public:
    void logInfo(const std::string& message) override {
        std::cout << "[INFO] " << message << std::endl;
    }
    
    void logError(const std::string& message) override {
        std::cerr << "[ERROR] " << message << std::endl;
    }
};

class FileLogger : public Logger {
private:
    std::string filename;
    
public:
    FileLogger(const std::string& filename) : filename(filename) {}
    
    void logInfo(const std::string& message) override {
        // Simulamos escritura a archivo
        std::cout << "Writing to " << filename << ": [INFO] " << message << std::endl;
    }
    
    void logError(const std::string& message) override {
        // Simulamos escritura a archivo
        std::cout << "Writing to " << filename << ": [ERROR] " << message << std::endl;
    }
};

class MySqlDatabase : public Database {
public:
    bool saveData(const std::string& key, const std::string& value) override {
        std::cout << "Saving to MySQL: " << key << " = " << value << std::endl;
        return true;
    }
    
    std::string fetchData(const std::string& key) override {
        std::cout << "Fetching from MySQL: " << key << std::endl;
        return "Data for " + key;
    }
};

// Clase cliente que usa dependencias inyectadas
class UserService {
private:
    Logger* logger;
    Database* database;
    
public:
    // Inyección por constructor
    UserService(Logger* logger, Database* database) 
        : logger(logger), database(database) {
        
        if (!logger || !database) {
            throw std::invalid_argument("Dependencies cannot be null");
        }
    }
    
    bool createUser(const std::string& username, const std::string& email) {
        logger->logInfo("Creando usuario: " + username);
        
        try {
            bool saved = database->saveData(username, email);
            if (saved) {
                logger->logInfo("Usuario creado exitosamente: " + username);
            } else {
                logger->logError("Error al crear usuario: " + username);
            }
            return saved;
        } catch (const std::exception& e) {
            logger->logError(std::string("Excepción al crear usuario: ") + e.what());
            return false;
        }
    }
    
    std::string getUserEmail(const std::string& username) {
        logger->logInfo("Buscando email para: " + username);
        return database->fetchData(username);
    }
};

// Una clase simple que actúa como contenedor DI
class DIContainer {
private:
    std::map<std::string, void*> services;
    
public:
    template<typename T>
    void registerService(const std::string& name, T* service) {
        services[name] = static_cast<void*>(service);
    }
    
    template<typename T>
    T* getService(const std::string& name) {
        auto it = services.find(name);
        if (it != services.end()) {
            return static_cast<T*>(it->second);
        }
        return nullptr;
    }
};

// Código cliente
void clientCode() {
    // Configuración manual de dependencias
    Logger* logger = new ConsoleLogger();
    Database* database = new MySqlDatabase();
    
    // Inyección manual
    UserService* userService = new UserService(logger, database);
    
    userService->createUser("john_doe", "john@example.com");
    std::string email = userService->getUserEmail("john_doe");
    
    std::cout << "Retrieved email: " << email << std::endl;
    
    // Limpieza
    delete userService;
    delete database;
    delete logger;
    
    std::cout << "\\n--- Using DIContainer ---\\n" << std::endl;
    
    // Uso con un contenedor DI simple
    DIContainer container;
    container.registerService("logger", new FileLogger("app.log"));
    container.registerService("database", new MySqlDatabase());
    
    // Obtener servicios del contenedor
    Logger* loggerFromDI = container.getService<Logger>("logger");
    Database* dbFromDI = container.getService<Database>("database");
    
    // Inyectar dependencias obtenidas del contenedor
    UserService* serviceFromDI = new UserService(loggerFromDI, dbFromDI);
    
    serviceFromDI->createUser("jane_smith", "jane@example.com");
    
    // Nota: En una aplicación real, el contenedor DI se encargaría de la gestión
    // del ciclo de vida y limpieza de los objetos
    delete serviceFromDI;
    delete loggerFromDI;
    delete dbFromDI;
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para nuestras dependencias (Logger y Database)." },
        { line: 16, text: "Implementación concreta de Logger que escribe en la consola." },
        { line: 26, text: "Otra implementación de Logger que escribe en un archivo." },
        { line: 42, text: "Implementación concreta de Database que simula una base de datos MySQL." },
        { line: 56, text: "Clase cliente (UserService) que usa las dependencias." },
        { line: 62, text: "Inyección por constructor: las dependencias se pasan en el constructor." },
        { line: 64, text: "Validación de dependencias para evitar NullPointerException." },
        { line: 69, text: "Métodos de la clase que usan las dependencias inyectadas." },
        { line: 90, text: "Implementación básica de un contenedor DI que registra y proporciona servicios." },
        { line: 107, text: "Código cliente que muestra dos formas de inyectar dependencias: manual y con el contenedor." }
      ]
    },
    cppModern: {
      code: `// Interfaces para servicios
class Logger {
public:
    virtual ~Logger() = default;
    virtual void logInfo(const std::string& message) = 0;
    virtual void logError(const std::string& message) = 0;
};

class Database {
public:
    virtual ~Database() = default;
    virtual bool saveData(const std::string& key, const std::string& value) = 0;
    virtual std::string fetchData(const std::string& key) = 0;
};

// Implementaciones concretas
class ConsoleLogger : public Logger {
public:
    void logInfo(const std::string& message) override {
        std::cout << "[INFO] " << message << std::endl;
    }
    
    void logError(const std::string& message) override {
        std::cerr << "[ERROR] " << message << std::endl;
    }
};

class FileLogger : public Logger {
private:
    std::string filename;
    
public:
    explicit FileLogger(std::string filename) : filename(std::move(filename)) {}
    
    void logInfo(const std::string& message) override {
        // Simulamos escritura a archivo
        std::cout << "Writing to " << filename << ": [INFO] " << message << std::endl;
    }
    
    void logError(const std::string& message) override {
        // Simulamos escritura a archivo
        std::cout << "Writing to " << filename << ": [ERROR] " << message << std::endl;
    }
};

class MySqlDatabase : public Database {
public:
    bool saveData(const std::string& key, const std::string& value) override {
        std::cout << "Saving to MySQL: " << key << " = " << value << std::endl;
        return true;
    }
    
    std::string fetchData(const std::string& key) override {
        std::cout << "Fetching from MySQL: " << key << std::endl;
        return "Data for " + key;
    }
};

// Clase cliente que usa dependencias inyectadas con smart pointers
class UserService {
private:
    std::shared_ptr<Logger> logger;
    std::shared_ptr<Database> database;
    
public:
    // Inyección por constructor usando smart pointers
    UserService(std::shared_ptr<Logger> logger, std::shared_ptr<Database> database) 
        : logger(std::move(logger)), database(std::move(database)) {
        
        if (!this->logger || !this->database) {
            throw std::invalid_argument("Dependencies cannot be null");
        }
    }
    
    bool createUser(const std::string& username, const std::string& email) {
        logger->logInfo("Creando usuario: " + username);
        
        try {
            bool saved = database->saveData(username, email);
            if (saved) {
                logger->logInfo("Usuario creado exitosamente: " + username);
            } else {
                logger->logError("Error al crear usuario: " + username);
            }
            return saved;
        } catch (const std::exception& e) {
            logger->logError(std::string("Excepción al crear usuario: ") + e.what());
            return false;
        }
    }
    
    std::string getUserEmail(const std::string& username) {
        logger->logInfo("Buscando email para: " + username);
        return database->fetchData(username);
    }
};

// Contenedor DI moderno usando type_index para identificar servicios por tipo
class DIContainer {
private:
    std::unordered_map<std::type_index, std::shared_ptr<void>> services;
    
public:
    // Registrar un servicio por su tipo
    template<typename T>
    void registerService(std::shared_ptr<T> service) {
        services[std::type_index(typeid(T))] = std::static_pointer_cast<void>(service);
    }
    
    // Registrar un servicio implementando una interface
    template<typename Interface, typename Impl>
    void registerService() {
        static_assert(std::is_base_of<Interface, Impl>::value, "Implementation must derive from Interface");
        auto service = std::make_shared<Impl>();
        services[std::type_index(typeid(Interface))] = std::static_pointer_cast<void>(service);
    }
    
    // Obtener un servicio por su tipo
    template<typename T>
    std::shared_ptr<T> getService() {
        auto it = services.find(std::type_index(typeid(T)));
        if (it != services.end()) {
            return std::static_pointer_cast<T>(it->second);
        }
        return nullptr;
    }
    
    // Factory para crear objetos con dependencias inyectadas
    template<typename T, typename... Args>
    std::shared_ptr<T> createWithDependencies(Args&&... args) {
        return std::make_shared<T>(std::forward<Args>(args)...);
    }
};

// Código cliente
void clientCode() {
    // Usando smart pointers para gestión automática de memoria
    auto container = std::make_shared<DIContainer>();
    
    // Registrar servicios
    container->registerService<Logger>(std::make_shared<ConsoleLogger>());
    container->registerService<Database>(std::make_shared<MySqlDatabase>());
    
    // Obtener servicios
    auto logger = container->getService<Logger>();
    auto database = container->getService<Database>();
    
    // Crear servicio con dependencias
    auto userService = container->createWithDependencies<UserService>(logger, database);
    
    // Usar el servicio
    userService->createUser("john_doe", "john@example.com");
    std::string email = userService->getUserEmail("john_doe");
    
    std::cout << "Retrieved email: " << email << std::endl;
    
    // No necesitamos delete, los smart pointers manejan la memoria
    
    // Registrar implementación alternativa
    container->registerService<Logger>(std::make_shared<FileLogger>("app.log"));
    
    // Crear otro servicio con la nueva implementación
    auto newLogger = container->getService<Logger>();
    auto newUserService = container->createWithDependencies<UserService>(newLogger, database);
    
    newUserService->createUser("jane_smith", "jane@example.com");
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para nuestras dependencias usando = default para el destructor virtual." },
        { line: 16, text: "Implementación concreta de Logger que escribe en la consola." },
        { line: 26, text: "Implementación del FileLogger con std::move para optimizar la asignación de string." },
        { line: 56, text: "Clase UserService que usa std::shared_ptr para gestionar las dependencias." },
        { line: 61, text: "Constructor que toma smart pointers y usa std::move para transferencia de propiedad." },
        { line: 84, text: "Contenedor DI moderno que usa std::type_index para identificar servicios por tipo." },
        { line: 89, text: "Método para registrar un servicio usando su tipo." },
        { line: 95, text: "Método avanzado para registrar servicios con comprobación de tipo en tiempo de compilación." },
        { line: 109, text: "Factory para crear objetos con sus dependencias, usando perfect forwarding." },
        { line: 117, text: "Código cliente que muestra cómo usar el contenedor DI moderno para gestionar dependencias." }
      ]
    },
    java: {
      code: `// Interfaces para los servicios
public interface Logger {
    void logInfo(String message);
    void logError(String message);
}

public interface Database {
    boolean saveData(String key, String value);
    String fetchData(String key);
}

// Implementaciones concretas
@Component
public class ConsoleLogger implements Logger {
    
    @Override
    public void logInfo(String message) {
        System.out.println("[INFO] " + message);
    }
    
    @Override
    public void logError(String message) {
        System.err.println("[ERROR] " + message);
    }
}

@Component
public class FileLogger implements Logger {
    
    private final String filename;
    
    public FileLogger(@Value("logger.filename:app.log") String filename) {
        this.filename = filename;
    }
    
    @Override
    public void logInfo(String message) {
        // Simulamos escritura a archivo
        System.out.println("Writing to " + filename + ": [INFO] " + message);
    }
    
    @Override
    public void logError(String message) {
        // Simulamos escritura a archivo
        System.out.println("Writing to " + filename + ": [ERROR] " + message);
    }
}

@Component
public class MySqlDatabase implements Database {
    
    @Override
    public boolean saveData(String key, String value) {
        System.out.println("Saving to MySQL: " + key + " = " + value);
        return true;
    }
    
    @Override
    public String fetchData(String key) {
        System.out.println("Fetching from MySQL: " + key);
        return "Data for " + key;
    }
}

// Servicio que usa dependencias inyectadas
@Service
public class UserService {
    
    private final Logger logger;
    private final Database database;
    
    // Inyección por constructor (recomendada en Spring)
    @Autowired
    public UserService(Logger logger, Database database) {
        this.logger = Objects.requireNonNull(logger, "Logger cannot be null");
        this.database = Objects.requireNonNull(database, "Database cannot be null");
    }
    
    public boolean createUser(String username, String email) {
        logger.logInfo("Creating user: " + username);
        
        try {
            boolean saved = database.saveData(username, email);
            if (saved) {
                logger.logInfo("User created successfully: " + username);
            } else {
                logger.logError("Error creating user: " + username);
            }
            return saved;
        } catch (Exception e) {
            logger.logError("Exception creating user: " + e.getMessage());
            return false;
        }
    }
    
    public String getUserEmail(String username) {
        logger.logInfo("Looking up email for: " + username);
        return database.fetchData(username);
    }
}

// Configuración de Spring para inyección de dependencias
@Configuration
public class AppConfig {
    
    // Definimos qué implementación de Logger usar
    @Bean
    @Primary
    public Logger consoleLogger() {
        return new ConsoleLogger();
    }
    
    @Bean
    @Qualifier("fileLogger")
    public Logger fileLogger() {
        return new FileLogger("application.log");
    }
    
    @Bean
    public Database mySqlDatabase() {
        return new MySqlDatabase();
    }
}

// Controlador que usa el servicio
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody UserDTO userDTO) {
        boolean created = userService.createUser(userDTO.getUsername(), userDTO.getEmail());
        
        if (created) {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("User created: " + userDTO.getUsername());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to create user");
        }
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<String> getUserEmail(@PathVariable String username) {
        String email = userService.getUserEmail(username);
        return ResponseEntity.ok(email);
    }
}

// Código cliente manual (sin Spring)
public class DIExample {
    
    public static void main(String[] args) {
        // Inyección manual
        Logger logger = new ConsoleLogger();
        Database database = new MySqlDatabase();
        
        UserService userService = new UserService(logger, database);
        
        userService.createUser("john_doe", "john@example.com");
        String email = userService.getUserEmail("john_doe");
        
        System.out.println("Retrieved email: " + email);
    }
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para los servicios Logger y Database." },
        { line: 12, text: "Implementación de Logger que usa la consola, con la anotación @Component para registro automático en Spring." },
        { line: 27, text: "Logger que escribe en un archivo, usando @Value para inyectar un valor de configuración." },
        { line: 45, text: "Implementación de Database que simula MySQL." },
        { line: 60, text: "Servicio de usuario con la anotación @Service que lo marca como un componente de servicio en Spring." },
        { line: 66, text: "Inyección de dependencias por constructor con @Autowired, el enfoque recomendado en Spring." },
        { line: 93, text: "Configuración de Spring usando @Configuration para definir beans." },
        { line: 97, text: "Definimos bean primario de Logger con @Primary, usado por defecto cuando se solicita un Logger." },
        { line: 115, text: "Controlador REST que utiliza el UserService inyectado por constructor." },
        { line: 143, text: "Ejemplo manual sin usar Spring, para mostrar cómo sería la inyección sin un framework." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Mecanismo de inyección',
      cppTraditional: 'Manual o con contenedor DI implementado manualmente. Requiere gestión de memoria manual.',
      cppModern: 'Smart pointers (shared_ptr) para gestión automática de memoria. Contenedores DI más sofisticados con type_index.',
      java: 'Frameworks completos como Spring que manejan automáticamente la inyección mediante anotaciones o XML.'
    },
    {
      title: 'Gestión del ciclo de vida',
      cppTraditional: 'Responsabilidad del programador. Propenso a fugas de memoria si no se maneja correctamente.',
      cppModern: 'Automática con smart pointers. Los objetos se destruyen cuando no hay más referencias.',
      java: 'Gestionada por el contenedor IoC (como Spring). Soporte para diferentes ámbitos (singleton, prototype, etc.).'
    },
    {
      title: 'Configuración',
      cppTraditional: 'Programática en el código o con archivos de configuración personalizados.',
      cppModern: 'Mismo enfoque que C++ tradicional pero con sintaxis más limpia.',
      java: 'Múltiples opciones: anotaciones (@Autowired, @Inject), XML, configuración Java (@Configuration, @Bean).'
    },
    {
      title: 'Detección de componentes',
      cppTraditional: 'No hay mecanismo estándar, requiere registro manual.',
      cppModern: 'No hay mecanismo estándar, aunque algunas bibliotecas facilitan el registro.',
      java: 'Escaneo automático de classpath con @ComponentScan. Registro automático de clases anotadas.'
    }
  ],
  
  notes: 'La Inyección de Dependencias es un patrón fundamental en el desarrollo de software moderno, especialmente en aplicaciones empresariales. En Java, frameworks como Spring han hecho que este patrón sea prácticamente estándar, mientras que en C++ no hay una solución dominante, aunque existen bibliotecas como Boost.DI o Google Fruit que proporcionan funcionalidad similar. La inyección por constructor es generalmente preferida por ser más explícita y facilitar las pruebas unitarias. En sistemas complejos, DI debe combinarse con otros patrones como Factory o Builder para la creación de objetos con configuraciones complejas.'
};

export default dependencyInjectionPattern; 