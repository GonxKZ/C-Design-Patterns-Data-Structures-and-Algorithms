const singletonPattern = {
  id: 'singleton',
  name: 'Singleton',
  category: 'creational',
  description: 'El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Implementación básica de Singleton
class Singleton {
private:
    // Constructor privado para evitar instanciación directa
    Singleton() {
        std::cout << "Inicializando el Singleton" << std::endl;
    }
    
    // Evitar copia del singleton
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
    
    // Instancia única estática
    static Singleton* instance;

public:
    // Método estático para acceder a la instancia
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
    
    // Método de ejemplo
    void someBusinessLogic() {
        std::cout << "Ejecutando lógica de negocio en el Singleton" << std::endl;
    }
    
    // Destructor
    ~Singleton() {
        std::cout << "Destruyendo el Singleton" << std::endl;
    }
};

// Inicialización del puntero estático
Singleton* Singleton::instance = nullptr;

// Singleton con protección multihilo
class ThreadSafeSingleton {
private:
    static ThreadSafeSingleton* instance;
    static std::mutex mutex;
    
    // Constructor privado
    ThreadSafeSingleton() {
        std::cout << "Inicializando el ThreadSafeSingleton" << std::endl;
    }
    
    // Evitar copia
    ThreadSafeSingleton(const ThreadSafeSingleton&) = delete;
    ThreadSafeSingleton& operator=(const ThreadSafeSingleton&) = delete;

public:
    // Método estático para acceder a la instancia (Thread-safe)
    static ThreadSafeSingleton* getInstance() {
        std::lock_guard<std::mutex> lock(mutex);
        if (instance == nullptr) {
            instance = new ThreadSafeSingleton();
        }
        return instance;
    }
    
    // Método de ejemplo
    void someBusinessLogic() {
        std::cout << "Ejecutando lógica de negocio en ThreadSafeSingleton" << std::endl;
    }
    
    // Destructor
    ~ThreadSafeSingleton() {
        std::cout << "Destruyendo el ThreadSafeSingleton" << std::endl;
    }
};

// Inicialización de miembros estáticos
ThreadSafeSingleton* ThreadSafeSingleton::instance = nullptr;
std::mutex ThreadSafeSingleton::mutex;

// Uso de los singletons
int main() {
    // Uso del singleton básico
    Singleton* s1 = Singleton::getInstance();
    s1->someBusinessLogic();
    
    Singleton* s2 = Singleton::getInstance();
    
    // Verificar que ambas variables apuntan a la misma instancia
    std::cout << "¿Misma instancia? " << (s1 == s2 ? "Sí" : "No") << std::endl;
    
    // Uso del singleton thread-safe
    ThreadSafeSingleton* ts1 = ThreadSafeSingleton::getInstance();
    ts1->someBusinessLogic();
    
    // Nota: En una aplicación real, necesitaríamos liberar la memoria
    // Sin embargo, en el caso de Singleton, generalmente viven durante toda 
    // la vida de la aplicación y son liberados al finalizar el programa
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias.' },
        { line: 4, text: 'Definimos la clase Singleton básica.' },
        { line: 6, text: 'El constructor es privado para evitar que se creen instancias directamente con "new".' },
        { line: 11, text: 'Eliminamos explícitamente el constructor de copia y el operador de asignación para evitar duplicación.' },
        { line: 15, text: 'Declaramos un puntero estático que almacenará la única instancia de la clase.' },
        { line: 19, text: 'Método público estático para acceder a la instancia. Este es el corazón del patrón.' },
        { line: 20, text: 'Comprobamos si la instancia ya existe. Si no, la creamos.' },
        { line: 26, text: 'Método de ejemplo que demuestra que el Singleton puede tener funcionalidad normal.' },
        { line: 36, text: 'Inicializamos el puntero estático como nullptr fuera de la definición de la clase.' },
        { line: 39, text: 'Implementamos una versión thread-safe del Singleton.' },
        { line: 41, text: 'Además del puntero estático, necesitamos un mutex para sincronización.' },
        { line: 57, text: 'En la versión thread-safe, usamos un lock_guard para asegurar que solo un hilo puede crear la instancia.' },
        { line: 76, text: 'Inicializamos ambos miembros estáticos de ThreadSafeSingleton.' },
        { line: 81, text: 'Demostramos el uso del Singleton básico.' },
        { line: 85, text: 'Obtenemos la instancia de nuevo y verificamos que es la misma que obtuvimos antes.' },
        { line: 88, text: 'Comprobamos que ambos punteros apuntan a la misma instancia.' },
        { line: 91, text: 'También demostramos el uso del Singleton thread-safe.' },
        { line: 94, text: 'Notamos que en una aplicación real, deberíamos manejar la liberación de memoria.' },
        { line: 96, text: 'Sin embargo, los Singletons generalmente viven durante toda la vida de la aplicación.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <mutex>

// Singleton implementado con Meyer's Singleton (inicialización estática local)
class MeyersSingleton {
private:
    // Constructor privado
    MeyersSingleton() {
        std::cout << "Inicializando Meyer's Singleton" << std::endl;
    }
    
    // Evitar copia y asignación
    MeyersSingleton(const MeyersSingleton&) = delete;
    MeyersSingleton& operator=(const MeyersSingleton&) = delete;
    
    // Evitar movimiento
    MeyersSingleton(MeyersSingleton&&) = delete;
    MeyersSingleton& operator=(MeyersSingleton&&) = delete;

public:
    // Método para acceder a la instancia
    static MeyersSingleton& getInstance() {
        // Inicialización estática garantizada thread-safe en C++11 y posteriores
        static MeyersSingleton instance;
        return instance;
    }
    
    // Método de ejemplo
    void someBusinessLogic() const {
        std::cout << "Ejecutando lógica de negocio en Meyer's Singleton" << std::endl;
    }
};

// Singleton con punteros inteligentes
class SharedPtrSingleton {
private:
    // Constructor privado
    SharedPtrSingleton() {
        std::cout << "Inicializando SharedPtr Singleton" << std::endl;
    }
    
    // Evitar copia, asignación y movimiento
    SharedPtrSingleton(const SharedPtrSingleton&) = delete;
    SharedPtrSingleton& operator=(const SharedPtrSingleton&) = delete;
    SharedPtrSingleton(SharedPtrSingleton&&) = delete;
    SharedPtrSingleton& operator=(SharedPtrSingleton&&) = delete;
    
    // Instancia única usando puntero inteligente
    static std::shared_ptr<SharedPtrSingleton> instance;
    static std::once_flag initInstanceFlag;

public:
    // Método para acceder a la instancia
    static std::shared_ptr<SharedPtrSingleton> getInstance() {
        // std::call_once garantiza que la inicialización se realiza solo una vez
        std::call_once(initInstanceFlag, []() {
            instance = std::shared_ptr<SharedPtrSingleton>(new SharedPtrSingleton());
        });
        return instance;
    }
    
    // Método de ejemplo
    void someBusinessLogic() const {
        std::cout << "Ejecutando lógica de negocio en SharedPtr Singleton" << std::endl;
    }
};

// Inicialización de miembros estáticos
std::shared_ptr<SharedPtrSingleton> SharedPtrSingleton::instance = nullptr;
std::once_flag SharedPtrSingleton::initInstanceFlag;

// Singleton con Curiously Recurring Template Pattern (CRTP)
template <typename T>
class SingletonBase {
protected:
    SingletonBase() = default;
    virtual ~SingletonBase() = default;
    
    // Evitar copia, asignación y movimiento
    SingletonBase(const SingletonBase&) = delete;
    SingletonBase& operator=(const SingletonBase&) = delete;
    SingletonBase(SingletonBase&&) = delete;
    SingletonBase& operator=(SingletonBase&&) = delete;

public:
    static T& getInstance() {
        static T instance;
        return instance;
    }
};

// Uso de CRTP para crear un Singleton con mínimo código
class CRTPSingleton : public SingletonBase<CRTPSingleton> {
    // Hacemos amigo a la clase base para que pueda acceder al constructor
    friend class SingletonBase<CRTPSingleton>;
    
private:
    CRTPSingleton() {
        std::cout << "Inicializando CRTP Singleton" << std::endl;
    }

public:
    void someBusinessLogic() const {
        std::cout << "Ejecutando lógica de negocio en CRTP Singleton" << std::endl;
    }
};

// Uso de los singletons modernos
int main() {
    // Meyers Singleton
    MeyersSingleton& s1 = MeyersSingleton::getInstance();
    s1.someBusinessLogic();
    
    MeyersSingleton& s2 = MeyersSingleton::getInstance();
    std::cout << "¿Misma instancia (Meyer's)? " << (&s1 == &s2 ? "Sí" : "No") << std::endl;
    
    // SharedPtr Singleton
    auto sps1 = SharedPtrSingleton::getInstance();
    sps1->someBusinessLogic();
    
    auto sps2 = SharedPtrSingleton::getInstance();
    std::cout << "¿Misma instancia (SharedPtr)? " << (sps1 == sps2 ? "Sí" : "No") << std::endl;
    
    // CRTP Singleton
    CRTPSingleton& crtp1 = CRTPSingleton::getInstance();
    crtp1.someBusinessLogic();
    
    CRTPSingleton& crtp2 = CRTPSingleton::getInstance();
    std::cout << "¿Misma instancia (CRTP)? " << (&crtp1 == &crtp2 ? "Sí" : "No") << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias, incluyendo memory para punteros inteligentes y mutex para sincronización.' },
        { line: 6, text: 'Implementamos Meyer\'s Singleton, que utiliza la inicialización estática local garantizada thread-safe en C++11 y posteriores.' },
        { line: 16, text: 'Además de eliminar constructor de copia y operador de asignación, también eliminamos movimiento.' },
        { line: 22, text: 'La clave de Meyer\'s Singleton: la variable estática local se inicializa la primera vez que se ejecuta la función.' },
        { line: 23, text: 'C++11 garantiza que esta inicialización es thread-safe, lo que elimina la necesidad de mutex.' },
        { line: 29, text: 'Marcamos el método como const para indicar que no modifica el estado del objeto.' },
        { line: 34, text: 'Implementamos un Singleton usando shared_ptr para gestión automática de memoria.' },
        { line: 47, text: 'Usamos std::once_flag con std::call_once para garantizar inicialización thread-safe.' },
        { line: 53, text: 'std::call_once garantiza que la lambda se ejecuta exactamente una vez, incluso con múltiples hilos.' },
        { line: 54, text: 'Usamos shared_ptr para gestionar automáticamente la memoria del Singleton.' },
        { line: 69, text: 'Implementamos un Singleton genérico usando CRTP (Curiously Recurring Template Pattern).' },
        { line: 70, text: 'El template recibe la clase derivada como parámetro para crear un Singleton reutilizable.' },
        { line: 86, text: 'CRTPSingleton implementa un Singleton con mínimo código heredando de SingletonBase.' },
        { line: 88, text: 'Declaramos la clase base como amiga para que pueda acceder al constructor privado.' },
        { line: 102, text: 'Demostramos el uso de Meyer\'s Singleton, que devuelve una referencia a la instancia.' },
        { line: 106, text: 'Verificamos que ambas referencias apuntan a la misma instancia.' },
        { line: 109, text: 'Demostramos el uso del SharedPtr Singleton, que devuelve un shared_ptr a la instancia.' },
        { line: 113, text: 'Verificamos que ambos shared_ptr apuntan a la misma instancia.' },
        { line: 116, text: 'Demostramos el uso del CRTP Singleton, que permite reutilizar la lógica de Singleton.' }
      ]
    },
    
    java: {
      code: `// Singleton básico en Java
class BasicSingleton {
    // Instancia única estática
    private static BasicSingleton instance;
    
    // Variable de ejemplo
    private String data;
    
    // Constructor privado
    private BasicSingleton() {
        System.out.println("Inicializando BasicSingleton");
        data = "";
    }
    
    // Método estático para acceder a la instancia
    public static synchronized BasicSingleton getInstance() {
        if (instance == null) {
            instance = new BasicSingleton();
        }
        return instance;
    }
    
    // Métodos de acceso a los datos
    public String getData() {
        return data;
    }
    
    public void setData(String data) {
        this.data = data;
    }
    
    // Método de ejemplo
    public void someBusinessLogic() {
        System.out.println("Ejecutando lógica de negocio en BasicSingleton");
    }
}

// Singleton con inicialización temprana (Eager initialization)
class EagerSingleton {
    // Instancia creada en tiempo de carga de clase
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    // Constructor privado
    private EagerSingleton() {
        System.out.println("Inicializando EagerSingleton");
    }
    
    // Método estático para acceder a la instancia
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
    
    // Método de ejemplo
    public void someBusinessLogic() {
        System.out.println("Ejecutando lógica de negocio en EagerSingleton");
    }
}

// Singleton con inicialización perezosa y holder estático (Bill Pugh Singleton)
class BillPughSingleton {
    // Constructor privado
    private BillPughSingleton() {
        System.out.println("Inicializando BillPughSingleton");
    }
    
    // Clase interna estática que contiene la instancia
    private static class SingletonHolder {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    // Método estático para acceder a la instancia
    public static BillPughSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
    
    // Método de ejemplo
    public void someBusinessLogic() {
        System.out.println("Ejecutando lógica de negocio en BillPughSingleton");
    }
}

// Singleton con enum (forma recomendada por Joshua Bloch)
enum EnumSingleton {
    INSTANCE;
    
    // Constructor
    EnumSingleton() {
        System.out.println("Inicializando EnumSingleton");
    }
    
    // Método de ejemplo
    public void someBusinessLogic() {
        System.out.println("Ejecutando lógica de negocio en EnumSingleton");
    }
}

// Singleton serializable y thread-safe con doble verificación de bloqueo
class DCLSingleton implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    
    // Volatile para garantizar visibilidad entre hilos
    private static volatile DCLSingleton instance;
    
    // Constructor privado
    private DCLSingleton() {
        System.out.println("Inicializando DCLSingleton");
        
        // Protección contra reflexión
        if (instance != null) {
            throw new RuntimeException("Use getInstance() method to get the instance.");
        }
    }
    
    // Método estático para acceder a la instancia con doble verificación de bloqueo
    public static DCLSingleton getInstance() {
        // Primera verificación (sin bloqueo)
        if (instance == null) {
            // Bloqueo sincronizado
            synchronized (DCLSingleton.class) {
                // Segunda verificación (con bloqueo)
                if (instance == null) {
                    instance = new DCLSingleton();
                }
            }
        }
        return instance;
    }
    
    // Método para manejar la deserialización
    protected Object readResolve() {
        return getInstance();
    }
    
    // Método de ejemplo
    public void someBusinessLogic() {
        System.out.println("Ejecutando lógica de negocio en DCLSingleton");
    }
}

// Demostración de uso
public class SingletonDemo {
    public static void main(String[] args) {
        // BasicSingleton
        BasicSingleton bs1 = BasicSingleton.getInstance();
        bs1.setData("Datos de prueba");
        bs1.someBusinessLogic();
        
        BasicSingleton bs2 = BasicSingleton.getInstance();
        System.out.println("¿Datos compartidos? " + bs2.getData());
        System.out.println("¿Misma instancia (Basic)? " + (bs1 == bs2 ? "Sí" : "No"));
        
        // EagerSingleton
        EagerSingleton es1 = EagerSingleton.getInstance();
        es1.someBusinessLogic();
        
        EagerSingleton es2 = EagerSingleton.getInstance();
        System.out.println("¿Misma instancia (Eager)? " + (es1 == es2 ? "Sí" : "No"));
        
        // BillPughSingleton
        BillPughSingleton bps1 = BillPughSingleton.getInstance();
        bps1.someBusinessLogic();
        
        BillPughSingleton bps2 = BillPughSingleton.getInstance();
        System.out.println("¿Misma instancia (BillPugh)? " + (bps1 == bps2 ? "Sí" : "No"));
        
        // EnumSingleton
        EnumSingleton.INSTANCE.someBusinessLogic();
        
        // DCLSingleton
        DCLSingleton dcl1 = DCLSingleton.getInstance();
        dcl1.someBusinessLogic();
        
        DCLSingleton dcl2 = DCLSingleton.getInstance();
        System.out.println("¿Misma instancia (DCL)? " + (dcl1 == dcl2 ? "Sí" : "No"));
    }
}`,
      explanation: [
        { line: 1, text: 'Implementamos BasicSingleton, una versión básica y sincronizada del patrón.' },
        { line: 3, text: 'Declaramos una variable estática que almacenará la única instancia.' },
        { line: 9, text: 'Constructor privado para evitar instanciación directa.' },
        { line: 15, text: 'Método sincronizado para garantizar thread-safety, aunque tiene impacto en rendimiento.' },
        { line: 36, text: 'Implementamos EagerSingleton con inicialización temprana.' },
        { line: 38, text: 'La instancia se crea inmediatamente cuando se carga la clase, garantizando thread-safety.' },
        { line: 53, text: 'BillPughSingleton utiliza el enfoque de "holder estático" introducido por Bill Pugh.' },
        { line: 59, text: 'La clase interna estática no se carga hasta que se llama a getInstance().' },
        { line: 73, text: 'EnumSingleton es la forma recomendada por Joshua Bloch en "Effective Java".' },
        { line: 74, text: 'Los enum en Java son inherentemente serializables y thread-safe, y previenen instanciación múltiple incluso con reflexión.' },
        { line: 86, text: 'DCLSingleton implementa el patrón con doble verificación de bloqueo para rendimiento óptimo.' },
        { line: 89, text: 'La palabra clave volatile es crucial para evitar problemas de ordenamiento de memoria en entornos multihilo.' },
        { line: 95, text: 'Añadimos protección contra el uso de reflexión para crear múltiples instancias.' },
        { line: 101, text: 'El patrón de doble verificación de bloqueo (DCL) minimiza el impacto en rendimiento de la sincronización.' },
        { line: 103, text: 'Primera verificación sin bloqueo para casos donde la instancia ya existe.' },
        { line: 107, text: 'Segunda verificación con bloqueo para garantizar que solo un hilo crea la instancia.' },
        { line: 114, text: 'El método readResolve maneja la deserialización para preservar la unicidad del singleton.' },
        { line: 127, text: 'Demostramos el uso de diferentes implementaciones de Singleton.' },
        { line: 130, text: 'Mostramos que los datos se comparten entre instancias de BasicSingleton.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Thread-safety',
      cppTraditional: 'Requiere implementación manual de bloqueo con mutex para garantizar thread-safety.',
      cppModern: 'Proporciona thread-safety implícita con la inicialización estática local (Meyer\'s Singleton) o usa primitivas modernas como std::call_once.',
      java: 'Ofrece múltiples enfoques, desde sincronización básica hasta inicialización perezosa con clases internas estáticas o enums.'
    },
    {
      title: 'Inicialización',
      cppTraditional: 'Inicialización perezosa explícita, la instancia se crea solo cuando se solicita por primera vez.',
      cppModern: 'Soporta tanto inicialización perezosa eficiente como inicialización temprana, según el enfoque elegido.',
      java: 'Soporta inicialización temprana (eager) o perezosa (lazy), con diferentes técnicas para cada enfoque.'
    },
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria, con riesgo de fugas si no se implementa correctamente.',
      cppModern: 'Usa variables estáticas locales o punteros inteligentes para gestión automática de memoria.',
      java: 'La memoria es gestionada automáticamente por el recolector de basura de Java.'
    },
    {
      title: 'Seguridad contra reflexión',
      cppTraditional: 'No aplicable (C++ no tiene reflection como Java).',
      cppModern: 'No aplicable (C++ no tiene reflection como Java).',
      java: 'Requiere protección explícita contra reflection, excepto cuando se usa enum que es inmune a este problema.'
    },
    {
      title: 'Serialización',
      cppTraditional: 'Requiere implementación manual de serialización/deserialización si es necesaria.',
      cppModern: 'Similar al tradicional, pero con mejores herramientas como cereal o boost::serialization.',
      java: 'Requiere implementar readResolve para mantener la unicidad durante la deserialización, excepto con enum.'
    }
  ],
  
  theory: {
    background: 'El patrón Singleton es uno de los patrones de diseño más simples y conocidos. Forma parte de los patrones creacionales del Gang of Four (GoF) y se utiliza para restringir la instanciación de una clase a un único objeto.',
    problem: 'A veces necesitamos asegurarnos de que una clase tenga una única instancia en todo el sistema. Por ejemplo, cuando una única clase debe coordinar acciones en todo el sistema, como un gestor de configuración, un pool de conexiones o un registro de eventos. Crear múltiples instancias podría causar problemas como conflictos de recursos o comportamiento inconsistente.',
    solution: 'El patrón Singleton resuelve este problema haciendo que la clase sea responsable de su propia instancia única. Implementa esto ocultando el constructor y proporcionando un método estático que devuelve la única instancia, creándola si aún no existe.',
    applicability: [
      'Cuando debe haber exactamente una instancia de una clase, y debe ser accesible desde un punto de acceso conocido.',
      'Cuando la única instancia debe ser extensible mediante subclases, y los clientes deben poder usar una instancia extendida sin modificar su código.',
      'Para gestionar recursos compartidos como pools de conexiones, caches, registros, o configuraciones del sistema.',
      'Para coordinar acciones en todo el sistema desde un único punto central.'
    ],
    consequences: [
      'Control de acceso a la instancia única, permitiendo restringir cuándo y cómo se accede a ella.',
      'Espacio de nombres reducido, evitando variables globales para almacenar objetos únicos.',
      'Permite refinamiento de operaciones y representación, ya que la clase puede ser subclasificada.',
      'Puede dificultar las pruebas unitarias al introducir estado global en la aplicación.',
      'Puede violar el principio de responsabilidad única al gestionar tanto su funcionalidad principal como asegurar su unicidad.'
    ]
  },
  
  notes: 'El patrón Singleton es a menudo criticado por introducir estado global en la aplicación, lo que puede dificultar las pruebas y aumentar el acoplamiento. Alternativas modernas incluyen la inyección de dependencias. En C++ moderno, la inicialización de Meyer\'s Singleton es generalmente la mejor opción por su simplicidad y thread-safety garantizada. En Java, el enfoque con enum es considerado el más seguro y conciso según "Effective Java" de Joshua Bloch, ya que resuelve automáticamente problemas de reflexión y serialización.'
};

export default singletonPattern;
