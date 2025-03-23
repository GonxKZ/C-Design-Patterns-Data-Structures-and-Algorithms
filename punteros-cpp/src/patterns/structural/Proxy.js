const proxyPattern = {
  id: 'proxy',
  name: 'Proxy',
  category: 'structural',
  description: 'El patrón Proxy proporciona un sustituto o representante de otro objeto para controlar el acceso a éste, permitiendo realizar operaciones antes o después de que la solicitud llegue al objeto original.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Interfaz Subject - Define las operaciones que RealSubject y Proxy implementarán
class Subject {
public:
    virtual ~Subject() {}
    virtual void request() const = 0;
};

// RealSubject - Define el objeto real que el proxy representa
class RealSubject : public Subject {
public:
    void request() const override {
        std::cout << "RealSubject: Manejando la solicitud." << std::endl;
    }
};

// Proxy - Mantiene una referencia al RealSubject y controla el acceso
class Proxy : public Subject {
private:
    RealSubject* realSubject;
    bool checkAccess() const {
        // Aquí podría haber lógica real de verificación de permisos
        std::cout << "Proxy: Verificando acceso antes de enviar al RealSubject." << std::endl;
        return true;
    }
    
    void logAccess() const {
        std::cout << "Proxy: Registrando el tiempo de acceso." << std::endl;
    }
    
public:
    Proxy() : realSubject(new RealSubject()) {}
    
    ~Proxy() {
        delete realSubject;
    }
    
    // El Proxy controla el acceso al RealSubject
    void request() const override {
        if (this->checkAccess()) {
            this->realSubject->request();
            this->logAccess();
        }
    }
};

// Función cliente que puede usar tanto RealSubject como Proxy
void clientCode(const Subject& subject) {
    subject.request();
}

int main() {
    std::cout << "Cliente: Ejecutando código con el RealSubject:" << std::endl;
    RealSubject* realSubject = new RealSubject();
    clientCode(*realSubject);
    std::cout << std::endl;
    
    std::cout << "Cliente: Ejecutando el mismo código con un Proxy:" << std::endl;
    Proxy* proxy = new Proxy();
    clientCode(*proxy);
    
    delete realSubject;
    delete proxy;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas estándar necesarias.' },
        { line: 4, text: 'La interfaz Subject define la interfaz común para RealSubject y Proxy.' },
        { line: 5, text: 'El destructor virtual es necesario para la correcta limpieza de objetos derivados.' },
        { line: 6, text: 'El método request() es la operación principal que RealSubject implementará y Proxy controlará.' },
        { line: 10, text: 'RealSubject implementa la funcionalidad real del objeto.' },
        { line: 12, text: 'Implementación directa de la operación request() que realiza el trabajo real.' },
        { line: 17, text: 'Proxy implementa la misma interfaz que RealSubject.' },
        { line: 19, text: 'Mantiene una referencia al RealSubject que estamos proxificando.' },
        { line: 20, text: 'checkAccess() realiza verificaciones de control de acceso antes de pasar la solicitud.' },
        { line: 25, text: 'logAccess() registra información sobre el acceso después de que se haya procesado la solicitud.' },
        { line: 30, text: 'Constructor del Proxy que inicializa el RealSubject.' },
        { line: 32, text: 'Destructor que libera la memoria del RealSubject.' },
        { line: 37, text: 'La implementación de request() en Proxy añade funcionalidad antes y después de llamar al RealSubject.' },
        { line: 38, text: 'Verifica el acceso antes de proceder.' },
        { line: 39, text: 'Delega la llamada real al RealSubject.' },
        { line: 40, text: 'Registra el acceso después de que la solicitud ha sido procesada.' },
        { line: 46, text: 'El código cliente trabaja con cualquier objeto que implemente la interfaz Subject.' },
        { line: 51, text: 'Demostración del uso directo del RealSubject.' },
        { line: 55, text: 'Demostración del uso del Proxy, que agrega funcionalidad sin cambiar el código cliente.' },
        { line: 59, text: 'Liberación de memoria en C++ tradicional.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <chrono>
#include <functional>

// Interfaz Subject usando smart pointers
class Subject {
public:
    virtual ~Subject() = default;
    virtual void request() const = 0;
};

// RealSubject - Define el objeto real que el proxy representa
class RealSubject : public Subject {
public:
    void request() const override {
        std::cout << "RealSubject: Manejando la solicitud (versión moderna)." << std::endl;
    }
};

// Proxy con smart pointers y functors
class Proxy : public Subject {
private:
    std::shared_ptr<RealSubject> realSubject;
    std::function<bool()> accessChecker;
    std::function<void()> accessLogger;
    
public:
    // Constructor con inyección de dependencias
    Proxy(std::shared_ptr<RealSubject> subject = nullptr,
          std::function<bool()> checker = []() { 
              std::cout << "Proxy: Verificando acceso (versión moderna)." << std::endl; 
              return true; 
          },
          std::function<void()> logger = []() { 
              auto now = std::chrono::system_clock::now();
              auto now_c = std::chrono::system_clock::to_time_t(now);
              std::cout << "Proxy: Acceso registrado a las " 
                        << std::ctime(&now_c); 
          })
        : realSubject(subject ? subject : std::make_shared<RealSubject>()),
          accessChecker(checker),
          accessLogger(logger) {}
    
    void request() const override {
        if (accessChecker()) {
            realSubject->request();
            accessLogger();
        }
    }
};

// La función cliente ahora usa smart pointers
void clientCode(const std::shared_ptr<Subject>& subject) {
    subject->request();
}

int main() {
    std::cout << "Cliente: Ejecutando código con el RealSubject:" << std::endl;
    auto realSubject = std::make_shared<RealSubject>();
    clientCode(realSubject);
    std::cout << std::endl;
    
    std::cout << "Cliente: Ejecutando el mismo código con un Proxy:" << std::endl;
    auto proxy = std::make_shared<Proxy>();
    clientCode(proxy);
    
    std::cout << std::endl;
    std::cout << "Cliente: Usando proxy con verificador personalizado:" << std::endl;
    // Personalización del comportamiento del proxy usando lambdas
    auto customProxy = std::make_shared<Proxy>(
        nullptr,
        []() { 
            std::cout << "Verificación personalizada: Acceso denegado!" << std::endl; 
            return false; 
        },
        []() { 
            std::cout << "Este mensaje no se mostrará porque la verificación falla." << std::endl; 
        }
    );
    clientCode(customProxy);
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos bibliotecas adicionales para smart pointers, manejo del tiempo y functores.' },
        { line: 8, text: 'Usamos =default para el destructor virtual siguiendo las recomendaciones de C++ moderno.' },
        { line: 21, text: 'El Proxy ahora utiliza shared_ptr para gestionar automáticamente la memoria.' },
        { line: 23, text: 'Utilizamos std::function para permitir la personalización del comportamiento del proxy.' },
        { line: 27, text: 'Constructor con inyección de dependencias y valores por defecto.' },
        { line: 28, text: 'Podemos proporcionar un RealSubject personalizado o crear uno por defecto.' },
        { line: 29, text: 'Functores por defecto para la verificación y registro, implementados como lambdas.' },
        { line: 36, text: 'Uso de std::chrono para obtener y formatear la hora actual.' },
        { line: 42, text: 'Inicialización de miembros con smart pointers y std::make_shared para mayor seguridad.' },
        { line: 47, text: 'La implementación de request() ahora usa los functores.' },
        { line: 55, text: 'La función cliente ahora recibe un shared_ptr en lugar de una referencia.' },
        { line: 60, text: 'Uso de std::make_shared para crear objetos gestionados por smart pointers.' },
        { line: 69, text: 'Demostración de la flexibilidad para personalizar el comportamiento del proxy.' },
        { line: 71, text: 'Lambda personalizada que siempre deniega el acceso.' }
      ]
    },
    
    java: {
      code: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Supplier;
import java.util.function.Consumer;

// Interfaz Subject
interface Subject {
    void request();
}

// RealSubject - Implementación real
class RealSubject implements Subject {
    @Override
    public void request() {
        System.out.println("RealSubject: Manejando la solicitud.");
    }
}

// Proxy - Control de acceso al RealSubject
class Proxy implements Subject {
    private RealSubject realSubject;
    private Supplier<Boolean> accessChecker;
    private Runnable accessLogger;
    
    // Constructor por defecto
    public Proxy() {
        this(new RealSubject(),
             () -> {
                 System.out.println("Proxy: Verificando acceso.");
                 return true;
             },
             () -> {
                 DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
                 System.out.println("Proxy: Acceso registrado a las " + 
                                    dtf.format(LocalDateTime.now()));
             });
    }
    
    // Constructor con inyección de dependencias
    public Proxy(RealSubject realSubject, 
                Supplier<Boolean> accessChecker,
                Runnable accessLogger) {
        this.realSubject = realSubject;
        this.accessChecker = accessChecker;
        this.accessLogger = accessLogger;
    }
    
    @Override
    public void request() {
        if (accessChecker.get()) {
            realSubject.request();
            accessLogger.run();
        }
    }
}

// Clase de demostración
public class ProxyDemo {
    // Función cliente
    public static void clientCode(Subject subject) {
        subject.request();
    }
    
    public static void main(String[] args) {
        System.out.println("Cliente: Ejecutando código con el RealSubject:");
        RealSubject realSubject = new RealSubject();
        clientCode(realSubject);
        System.out.println();
        
        System.out.println("Cliente: Ejecutando el mismo código con un Proxy:");
        Proxy proxy = new Proxy();
        clientCode(proxy);
        
        System.out.println();
        System.out.println("Cliente: Usando proxy con verificador personalizado:");
        // Personalización del comportamiento del proxy usando lambdas
        Proxy customProxy = new Proxy(
            new RealSubject(),
            () -> { 
                System.out.println("Verificación personalizada: Acceso denegado!"); 
                return false; 
            },
            () -> System.out.println("Este mensaje no se mostrará porque la verificación falla.")
        );
        clientCode(customProxy);
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para el manejo de fechas y funciones lambda en Java.' },
        { line: 6, text: 'Definimos la interfaz Subject que implementarán tanto RealSubject como Proxy.' },
        { line: 11, text: 'Implementación directa de RealSubject.' },
        { line: 19, text: 'La clase Proxy implementa la misma interfaz Subject.' },
        { line: 21, text: 'Usamos interfaces funcionales (Supplier y Runnable) para personalizar el comportamiento.' },
        { line: 25, text: 'Constructor por defecto que inicializa con comportamientos predeterminados.' },
        { line: 37, text: 'Utilizamos DateTimeFormatter para formatear la fecha y hora del registro.' },
        { line: 43, text: 'Constructor con inyección de dependencias para mayor flexibilidad.' },
        { line: 52, text: 'La implementación de request() utiliza los proveedores de comportamiento.' },
        { line: 53, text: 'Usamos get() para obtener el resultado booleano del Supplier.' },
        { line: 55, text: 'Ejecutamos el logger con run() al tratarse de un Runnable.' },
        { line: 62, text: 'El código cliente funciona con cualquier objeto que implemente Subject.' },
        { line: 73, text: 'Demostración de la personalización del proxy con expresiones lambda.' },
        { line: 77, text: 'Lambda que siempre devuelve false para mostrar el caso de acceso denegado.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Gestión manual de memoria con new/delete para crear y destruir objetos. Requiere implementar el destructor para evitar fugas de memoria.',
      cppModern: 'Uso de smart pointers (std::shared_ptr) para la gestión automática de memoria, eliminando la necesidad de delete manual y reduciendo el riesgo de fugas.',
      java: 'Gestión automática de memoria mediante el recolector de basura, simplificando el código al no requerir liberación explícita de recursos.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'Implementación menos flexible con comportamientos codificados directamente en las clases. Extender funcionalidades requiere crear subclases o modificar el código existente.',
      cppModern: 'Mayor flexibilidad mediante functores (std::function) e inyección de dependencias, permitiendo personalizar el comportamiento sin modificar las clases.',
      java: 'Enfoque similar al C++ moderno, usando interfaces funcionales (Supplier, Consumer, Runnable) para una configuración flexible del comportamiento.'
    },
    {
      title: 'Manejo del tiempo',
      cppTraditional: 'Utiliza la API C estándar para el manejo del tiempo (ctime), que es menos intuitiva y requiere más código.',
      cppModern: 'Usa la biblioteca moderna de tiempo (std::chrono) para un manejo más seguro y preciso de fechas y horas.',
      java: 'Implementa el API de fecha y hora moderno (java.time) con LocalDateTime y DateTimeFormatter para una gestión sencilla y legible.'
    }
  ],
  
  theory: {
    background: 'El patrón Proxy fue introducido por el Gang of Four (GoF) como un patrón estructural. Proviene del concepto de representación o sustitución, donde un objeto actúa en lugar de otro.',
    problem: 'Necesitamos controlar el acceso a un objeto, ya sea porque es costoso de crear, requiere seguridad, o necesitamos añadir funcionalidades antes o después de acceder al objeto real.',
    solution: 'El patrón Proxy proporciona un sustituto o placeholder para otro objeto para controlar el acceso a éste. El proxy implementa la misma interfaz que el objeto real, por lo que es transparente para el cliente.',
    applicability: [
      'Control de acceso: cuando necesitas restringir el acceso al objeto original basándote en ciertos derechos o condiciones.',
      'Proxy virtual: para crear objetos pesados bajo demanda, posponiendo su creación hasta que realmente se necesite.',
      'Proxy de protección: para controlar el acceso a recursos sensibles según los permisos del solicitante.',
      'Proxy remoto: para representar un objeto que está en un espacio de direcciones diferente o en otro servidor.',
      'Proxy de cache: para almacenar los resultados de operaciones costosas y reutilizarlos cuando se repitan las mismas solicitudes.',
      'Proxy de registro: para mantener un registro de accesos o modificaciones al objeto original.'
    ],
    benefits: [
      'Introduce un nivel de indirección para el acceso al objeto real.',
      'Puede mejorar el rendimiento mediante técnicas como carga perezosa o caché.',
      'Permite añadir comportamientos antes o después de acceder al objeto real sin modificarlo.',
      'Sigue el principio de responsabilidad única al separar las preocupaciones de acceso y de negocio.'
    ],
    drawbacks: [
      'Introduce una capa adicional de indirección que puede complicar el código.',
      'La respuesta del servicio podría retrasarse debido al procesamiento adicional del proxy.',
      'Implementaciones complejas pueden llevar a problemas de rendimiento si no se diseñan correctamente.'
    ]
  }
};

export default proxyPattern;
