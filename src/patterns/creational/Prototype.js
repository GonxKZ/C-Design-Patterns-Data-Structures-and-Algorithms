const prototypePattern = {
  id: 'prototype',
  name: 'Prototype',
  category: 'creational',
  description: 'Especifica los tipos de objetos a crear usando una instancia prototípica, y crea nuevos objetos copiando este prototipo. Permite crear nuevos objetos duplicando objetos existentes, evitando la dependencia de sus clases concretas.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <unordered_map>

// Clase Prototype abstracta
class Prototype {
protected:
    std::string id;
    
public:
    Prototype(std::string id) : id(id) {}
    virtual ~Prototype() {}
    
    std::string getId() const {
        return id;
    }
    
    // Método clone() que las subclases deben implementar
    virtual Prototype* clone() const = 0;
    
    virtual void printDetails() const {
        std::cout << "ID: " << id << std::endl;
    }
};

// Implementación concreta de Prototype
class ConcretePrototype1 : public Prototype {
private:
    std::string field1;
    int field2;
    
public:
    ConcretePrototype1(std::string id, std::string field1, int field2)
        : Prototype(id), field1(field1), field2(field2) {}
    
    // Crea una copia del objeto actual
    Prototype* clone() const override {
        return new ConcretePrototype1(*this);
    }
    
    void printDetails() const override {
        Prototype::printDetails();
        std::cout << "Field1: " << field1 << std::endl;
        std::cout << "Field2: " << field2 << std::endl;
    }
};

// Otra implementación concreta de Prototype
class ConcretePrototype2 : public Prototype {
private:
    std::string field1;
    float field2;
    bool field3;
    
public:
    ConcretePrototype2(std::string id, std::string field1, float field2, bool field3)
        : Prototype(id), field1(field1), field2(field2), field3(field3) {}
    
    // Crea una copia del objeto actual
    Prototype* clone() const override {
        return new ConcretePrototype2(*this);
    }
    
    void printDetails() const override {
        Prototype::printDetails();
        std::cout << "Field1: " << field1 << std::endl;
        std::cout << "Field2: " << field2 << std::endl;
        std::cout << "Field3: " << (field3 ? "true" : "false") << std::endl;
    }
};

// Clase Registry que mantiene los prototipos
class PrototypeRegistry {
private:
    std::unordered_map<std::string, Prototype*> prototypes;
    
public:
    PrototypeRegistry() {}
    
    ~PrototypeRegistry() {
        for (auto& item : prototypes) {
            delete item.second;
        }
    }
    
    void addPrototype(const std::string& id, Prototype* prototype) {
        prototypes[id] = prototype;
    }
    
    Prototype* getPrototype(const std::string& id) {
        if (prototypes.find(id) != prototypes.end()) {
            return prototypes[id]->clone();
        }
        return nullptr;
    }
};

// Función cliente
void clientCode() {
    PrototypeRegistry registry;
    
    ConcretePrototype1* p1 = new ConcretePrototype1("proto1", "value1", 42);
    registry.addPrototype(p1->getId(), p1);
    
    ConcretePrototype2* p2 = new ConcretePrototype2("proto2", "value2", 3.14f, true);
    registry.addPrototype(p2->getId(), p2);
    
    std::cout << "Clonando proto1:" << std::endl;
    Prototype* clone1 = registry.getPrototype("proto1");
    if (clone1) {
        clone1->printDetails();
        delete clone1;
    }
    
    std::cout << "\nClonando proto2:" << std::endl;
    Prototype* clone2 = registry.getPrototype("proto2");
    if (clone2) {
        clone2->printDetails();
        delete clone2;
    }
}

int main() {
    clientCode();
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para el ejemplo.' },
        { line: 5, text: 'Definimos la clase abstracta Prototype que todas las clases prototipo concretas heredarán.' },
        { line: 9, text: 'Constructor que inicializa el ID del prototipo.' },
        { line: 10, text: 'Destructor virtual para permitir la destrucción adecuada de las clases derivadas.' },
        { line: 16, text: 'Método clone() puro virtual que las clases concretas deben implementar para crear copias de sí mismas.' },
        { line: 26, text: 'ConcretePrototype1 es una implementación específica de Prototype con sus propios campos.' },
        { line: 33, text: 'La implementación de clone() crea una nueva instancia usando el constructor de copia.' },
        { line: 42, text: 'ConcretePrototype2 es otra implementación con diferentes campos, mostrando la flexibilidad del patrón.' },
        { line: 49, text: 'Implementación similar de clone() para ConcretePrototype2.' },
        { line: 62, text: 'PrototypeRegistry es una clase auxiliar que almacena prototipos y proporciona acceso a ellos.' },
        { line: 69, text: 'El destructor de PrototypeRegistry libera la memoria de todos los prototipos almacenados.' },
        { line: 75, text: 'addPrototype() registra un nuevo prototipo en el registro.' },
        { line: 79, text: 'getPrototype() busca un prototipo por ID y devuelve una copia si lo encuentra.' },
        { line: 89, text: 'En la función cliente, creamos un registro y algunos prototipos iniciales.' },
        { line: 95, text: 'Demostramos cómo obtener clones de los prototipos registrados y usar sus funcionalidades.' },
        { line: 107, text: 'Es importante liberar la memoria de los clones cuando ya no son necesarios.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>
#include <functional>

// Clase Prototype abstracta usando smart pointers
class Prototype {
protected:
    std::string id;
    
public:
    Prototype(std::string id) : id(std::move(id)) {}
    virtual ~Prototype() = default;
    
    std::string getId() const {
        return id;
    }
    
    // Método clone() que devuelve un unique_ptr
    virtual std::unique_ptr<Prototype> clone() const = 0;
    
    virtual void printDetails() const {
        std::cout << "ID: " << id << std::endl;
    }
};

// Implementación concreta de Prototype
class ConcretePrototype1 : public Prototype {
private:
    std::string field1;
    int field2;
    
public:
    ConcretePrototype1(std::string id, std::string field1, int field2)
        : Prototype(std::move(id)), field1(std::move(field1)), field2(field2) {}
    
    // Implementación moderna de clone()
    std::unique_ptr<Prototype> clone() const override {
        return std::make_unique<ConcretePrototype1>(*this);
    }
    
    void printDetails() const override {
        Prototype::printDetails();
        std::cout << "Field1: " << field1 << std::endl;
        std::cout << "Field2: " << field2 << std::endl;
    }
};

// Otra implementación concreta de Prototype
class ConcretePrototype2 : public Prototype {
private:
    std::string field1;
    float field2;
    bool field3;
    
public:
    ConcretePrototype2(std::string id, std::string field1, float field2, bool field3)
        : Prototype(std::move(id)), field1(std::move(field1)), field2(field2), field3(field3) {}
    
    std::unique_ptr<Prototype> clone() const override {
        return std::make_unique<ConcretePrototype2>(*this);
    }
    
    void printDetails() const override {
        Prototype::printDetails();
        std::cout << "Field1: " << field1 << std::endl;
        std::cout << "Field2: " << field2 << std::endl;
        std::cout << "Field3: " << (field3 ? "true" : "false") << std::endl;
    }
};

// Versión moderna del registro de prototipos
class PrototypeRegistry {
private:
    std::unordered_map<std::string, std::unique_ptr<Prototype>> prototypes;
    
public:
    PrototypeRegistry() = default;
    
    // Ya no necesitamos destructor personalizado gracias a unique_ptr
    
    void addPrototype(std::string id, std::unique_ptr<Prototype> prototype) {
        prototypes[id] = std::move(prototype);
    }
    
    std::unique_ptr<Prototype> getPrototype(const std::string& id) {
        auto it = prototypes.find(id);
        if (it != prototypes.end()) {
            return it->second->clone();
        }
        return nullptr;
    }
    
    // Método helper para facilitar la adición de prototipos
    template<typename T, typename... Args>
    void registerPrototype(std::string id, Args&&... args) {
        prototypes[id] = std::make_unique<T>(id, std::forward<Args>(args)...);
    }
};

// Función cliente
void clientCode() {
    PrototypeRegistry registry;
    
    // Registramos prototipos usando el método helper
    registry.registerPrototype<ConcretePrototype1>("proto1", "value1", 42);
    registry.registerPrototype<ConcretePrototype2>("proto2", "value2", 3.14f, true);
    
    // También podemos registrar usando addPrototype
    registry.addPrototype("proto3", 
        std::make_unique<ConcretePrototype1>("proto3", "another value", 100));
    
    std::cout << "Clonando proto1:" << std::endl;
    auto clone1 = registry.getPrototype("proto1");
    if (clone1) {
        clone1->printDetails();
    }
    
    std::cout << "\nClonando proto2:" << std::endl;
    auto clone2 = registry.getPrototype("proto2");
    if (clone2) {
        clone2->printDetails();
    }
    
    std::cout << "\nClonando proto3:" << std::endl;
    auto clone3 = registry.getPrototype("proto3");
    if (clone3) {
        clone3->printDetails();
    }
    
    // No hay necesidad de delete - los smart pointers manejan la memoria
}

int main() {
    clientCode();
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos bibliotecas adicionales para smart pointers y expresiones lambda.' },
        { line: 7, text: 'La clase Prototype sigue siendo la base del patrón.' },
        { line: 11, text: 'Usamos std::move para la inicialización de strings, mejorando el rendimiento.' },
        { line: 12, text: 'Usamos =default para el destructor virtual, siguiendo las recomendaciones de C++11/14.' },
        { line: 17, text: 'El método clone() ahora devuelve std::unique_ptr en lugar de punteros crudos.' },
        { line: 32, text: 'Usamos std::move para transferir la propiedad de los strings sin copias innecesarias.' },
        { line: 35, text: 'La implementación de clone() utiliza std::make_unique para crear objetos con gestión automática de memoria.' },
        { line: 67, text: 'PrototypeRegistry ahora almacena std::unique_ptr en lugar de punteros crudos.' },
        { line: 70, text: 'Usamos =default para el constructor ya que no hay inicialización especial necesaria.' },
        { line: 72, text: 'Ya no necesitamos un destructor personalizado ya que unique_ptr se encarga de liberar la memoria.' },
        { line: 74, text: 'addPrototype ahora toma un std::unique_ptr por valor y usa std::move para transferir la propiedad.' },
        { line: 78, text: 'getPrototype devuelve un std::unique_ptr, implementando una gestión segura de la memoria.' },
        { line: 86, text: 'Agregamos un método helper con plantillas para facilitar el registro de prototipos.' },
        { line: 87, text: 'Usamos perfect forwarding con std::forward para pasar los argumentos eficientemente.' },
        { line: 96, text: 'En la función cliente, registramos prototipos usando el método helper con plantillas.' },
        { line: 100, text: 'También demostramos el uso de addPrototype con std::make_unique.' },
        { line: 117, text: 'Ya no necesitamos llamadas explícitas a delete, los smart pointers se encargan de eso.' }
      ]
    },
    
    java: {
      code: `import java.util.HashMap;
import java.util.Map;

// Interfaz Prototype
interface Prototype extends Cloneable {
    Prototype clone();
    void printDetails();
}

// Implementación concreta de Prototype
class ConcretePrototype1 implements Prototype {
    private String id;
    private String field1;
    private int field2;
    
    public ConcretePrototype1(String id, String field1, int field2) {
        this.id = id;
        this.field1 = field1;
        this.field2 = field2;
    }
    
    @Override
    public Prototype clone() {
        try {
            // Realizamos una clonación superficial utilizando Object.clone()
            // Para objetos más complejos, podríamos necesitar una clonación profunda
            return (Prototype) super.clone();
        } catch (CloneNotSupportedException e) {
            // Devolvemos una nueva instancia si la clonación nativa falla
            return new ConcretePrototype1(id, field1, field2);
        }
    }
    
    @Override
    public void printDetails() {
        System.out.println("ID: " + id);
        System.out.println("Field1: " + field1);
        System.out.println("Field2: " + field2);
    }
    
    public String getId() {
        return id;
    }
}

// Otra implementación concreta de Prototype
class ConcretePrototype2 implements Prototype {
    private String id;
    private String field1;
    private float field2;
    private boolean field3;
    
    public ConcretePrototype2(String id, String field1, float field2, boolean field3) {
        this.id = id;
        this.field1 = field1;
        this.field2 = field2;
        this.field3 = field3;
    }
    
    @Override
    public Prototype clone() {
        try {
            return (Prototype) super.clone();
        } catch (CloneNotSupportedException e) {
            return new ConcretePrototype2(id, field1, field2, field3);
        }
    }
    
    @Override
    public void printDetails() {
        System.out.println("ID: " + id);
        System.out.println("Field1: " + field1);
        System.out.println("Field2: " + field2);
        System.out.println("Field3: " + field3);
    }
    
    public String getId() {
        return id;
    }
}

// Registro de prototipos
class PrototypeRegistry {
    private Map<String, Prototype> prototypes = new HashMap<>();
    
    public void addPrototype(String id, Prototype prototype) {
        prototypes.put(id, prototype);
    }
    
    public Prototype getPrototype(String id) {
        Prototype prototype = prototypes.get(id);
        return prototype != null ? prototype.clone() : null;
    }
}

// Clase de demostración
public class PrototypeDemo {
    public static void main(String[] args) {
        PrototypeRegistry registry = new PrototypeRegistry();
        
        ConcretePrototype1 p1 = new ConcretePrototype1("proto1", "value1", 42);
        registry.addPrototype(p1.getId(), p1);
        
        ConcretePrototype2 p2 = new ConcretePrototype2("proto2", "value2", 3.14f, true);
        registry.addPrototype(p2.getId(), p2);
        
        System.out.println("Clonando proto1:");
        Prototype clone1 = registry.getPrototype("proto1");
        if (clone1 != null) {
            clone1.printDetails();
        }
        
        System.out.println("\nClonando proto2:");
        Prototype clone2 = registry.getPrototype("proto2");
        if (clone2 != null) {
            clone2.printDetails();
        }
        
        // Demostración de clonación sin registro
        System.out.println("\nClonación directa:");
        Prototype original = new ConcretePrototype1("direct", "direct value", 100);
        Prototype directClone = original.clone();
        directClone.printDetails();
    }
}`,
      explanation: [
        { line: 4, text: 'La interfaz Prototype extiende Cloneable, que es una interfaz marcadora en Java para indicar que una clase puede ser clonada.' },
        { line: 5, text: 'Definimos el método clone() que todas las implementaciones deben proporcionar.' },
        { line: 10, text: 'ConcretePrototype1 implementa la interfaz Prototype.' },
        { line: 20, text: 'En la implementación de clone(), usamos super.clone() que proporciona una clonación superficial del objeto.' },
        { line: 23, text: 'Capturamos CloneNotSupportedException que puede ser lanzada por super.clone().' },
        { line: 25, text: 'Como plan de respaldo, creamos una nueva instancia manualmente si la clonación nativa falla.' },
        { line: 41, text: 'ConcretePrototype2 es otra implementación con diferentes campos.' },
        { line: 69, text: 'El PrototypeRegistry mantiene un mapa de prototipos registrados.' },
        { line: 76, text: 'Cuando solicitamos un prototipo, devolvemos un clon, no el original registrado.' },
        { line: 85, text: 'En el método main, demostramos el registro y clonación de prototipos.' },
        { line: 103, text: 'También mostramos cómo clonar directamente sin usar el registro.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Gestión manual de memoria con new/delete, que requiere una cuidadosa limpieza para evitar fugas de memoria. La clonación se realiza con punteros crudos.',
      cppModern: 'Utiliza smart pointers (std::unique_ptr) para la gestión automática de memoria, eliminando la necesidad de delete explícito y evitando fugas de memoria.',
      java: 'Memoria gestionada automáticamente por el recolector de basura. Utiliza la interfaz Cloneable nativa de Java para la clonación, aunque requiere manejo de excepciones.'
    },
    {
      title: 'Implementación de clone()',
      cppTraditional: 'Implementaciones de clone() devuelven punteros crudos (Prototype*). El cliente es responsable de liberar la memoria de los objetos clonados.',
      cppModern: 'clone() devuelve std::unique_ptr para gestión automática de la memoria. Usa std::make_unique para crear objetos de forma segura.',
      java: 'Utiliza el mecanismo de clonación integrado de Java mediante super.clone(), que proporciona una clonación superficial. Si se necesita una clonación profunda, hay que implementarla manualmente.'
    },
    {
      title: 'Facilidad de uso y sintaxis',
      cppTraditional: 'Sintaxis más verbosa con manejo explícito de punteros. Requiere más código para registro y gestión de prototipos.',
      cppModern: 'Sintaxis más limpia con templates y perfect forwarding. Proporciona métodos helper para facilitar el registro de prototipos.',
      java: 'Sintaxis concisa gracias a la interfaz Cloneable. Manejo de excepciones integrado para la clonación. No hay necesidad de preocuparse por la gestión de memoria.'
    },
    {
      title: 'Rendimiento de clonación',
      cppTraditional: 'Control total sobre el proceso de clonación, pero requiere implementación manual de copia profunda cuando sea necesario.',
      cppModern: 'Similar al tradicional pero con menor riesgo de fugas de memoria. Las técnicas move semantics pueden mejorar el rendimiento.',
      java: 'La clonación superficial es rápida, pero la implementación manual de clonación profunda puede ser más compleja y costosa.'
    },
    {
      title: 'Flexibilidad en tiempo de ejecución',
      cppTraditional: 'Permite añadir y modificar prototipos en tiempo de ejecución, pero con mayor complejidad de gestión.',
      cppModern: 'Mayor flexibilidad con menor código, gracias a las funciones de orden superior y lambdas para manipular prototipos.',
      java: 'Soporte nativo para reflexión facilita la manipulación dinámica de prototipos, especialmente útil en frameworks.'
    }
  ],
  
  theory: {
    background: 'El patrón Prototype fue formalizado por la Banda de los Cuatro (GoF) y se inspira en procesos biológicos de reproducción celular. En la naturaleza, las células se duplican para crecer y reparar tejidos. De manera similar, este patrón permite que los objetos se dupliquen a sí mismos sin acoplar el código a sus clases específicas.',
    
    problem: 'A veces necesitamos crear objetos que son similares a objetos existentes, o queremos crear objetos cuando sólo tenemos ejemplos en tiempo de ejecución. Además, la creación directa de objetos puede ser costosa o compleja cuando implica operaciones intensivas, acceso a bases de datos o comunicación en red. La dependencia de clases concretas para crear objetos también limita la flexibilidad del diseño.',
    
    solution: 'El patrón Prototype define una interfaz para crear un clon de un objeto existente. En lugar de crear objetos desde cero, clonamos una instancia ya configurada. Esto suele implementarse declarando una interfaz abstracta con un método de clonación, que las clases concretas implementan para duplicarse a sí mismas.',
    
    applicability: [
      'Cuando las clases a instanciar son especificadas en tiempo de ejecución (dinámicamente)',
      'Para evitar construir una jerarquía de fábricas paralela a la jerarquía de productos',
      'Cuando las instancias de una clase pueden tener uno de entre pocos estados diferentes',
      'Cuando la creación de objetos es costosa en comparación con la clonación',
      'Para ocultar la complejidad de crear objetos complejos al cliente',
      'Para mantener un registro de objetos que pueden crearse mediante composición'
    ],
    
    consequences: [
      'Oculta las clases concretas al cliente, reduciendo el conocimiento requerido para el sistema',
      'Permite agregar y eliminar productos en tiempo de ejecución',
      'Especifica nuevos objetos variando sus valores o estructura, no solo parámetros fijos',
      'Reduce la necesidad de subclases',
      'Permite configurar una aplicación con clases dinámicamente',
      'Puede introducir complejidad para implementar el mecanismo de clonación, especialmente con objetos que no soportan copia o tienen referencias circulares'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Prototype?</h3>
      <ul>
        <li><strong>Objetos con configuración costosa:</strong> Cuando crear un objeto desde cero es costoso (accesos a BD, operaciones de red, cálculos intensivos).</li>
        <li><strong>Minimizar la creación de subclases:</strong> Cuando un sistema debería ser independiente de cómo se crean, componen y representan sus productos.</li>
        <li><strong>Configuraciones dinámicas:</strong> Cuando necesitas instanciar clases en tiempo de ejecución, por ejemplo, a través de la reflexión.</li>
        <li><strong>Evitar reinicialización repetitiva:</strong> Cuando los objetos se inicializan con valores por defecto que son costosos de obtener.</li>
        <li><strong>Composición sobre herencia:</strong> Cuando es preferible copiar un objeto existente en lugar de extender mediante herencia.</li>
        <li><strong>Precargar configuraciones:</strong> Cuando tienes objetos predefinidos que se modifican ligeramente para nuevas instancias.</li>
        <li><strong>Reducción de memoria:</strong> Cuando muchos objetos deben compartir cierta configuración pero variar en algunos atributos (relacionado con Flyweight).</li>
      </ul>
      
      <h3>Variantes del patrón Prototype:</h3>
      <ul>
        <li><strong>Prototype con un registro:</strong> Mantiene un registro de prototipos disponibles por nombre o tipo, permitiendo búsquedas y clonaciones dinámicas.</li>
        <li><strong>Prototype con copia profunda vs. superficial:</strong> Dependiendo de la complejidad del objeto, puede requerirse una copia profunda que duplique también sus objetos referenciados.</li>
        <li><strong>Prototype con serialización:</strong> Usa serialización y deserialización para realizar copias profundas automáticamente.</li>
        <li><strong>Clone Manager:</strong> Un objeto separado que maneja la complejidad de la clonación, especialmente útil con objetos complejos.</li>
        <li><strong>Prototype Factory:</strong> Combina Prototype con Factory Method para gestionar la creación y clonación de objetos.</li>
        <li><strong>Prototype parametrizado:</strong> Donde la clonación incluye modificaciones basadas en parámetros proporcionados.</li>
        <li><strong>Virtual Constructor:</strong> Un mecanismo donde un objeto puede crearse especificando su clase en tiempo de ejecución y luego clonarse.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Aplicaciones gráficas:</strong> Copiar objetos gráficos como formas o capas en herramientas de diseño (Photoshop, Illustrator).</li>
        <li><strong>Navegadores web:</strong> La función de clonar pestañas duplica toda la configuración y estado de la pestaña original.</li>
        <li><strong>Juegos:</strong> Crear múltiples instancias de enemigos, obstáculos o efectos visuales basados en plantillas.</li>
        <li><strong>Objetos de configuración:</strong> Crear variantes de una configuración base modificando solo algunos parámetros.</li>
        <li><strong>Cachés de objetos:</strong> Mantener versiones prototípicas de objetos complejos que se clonan cuando se necesitan.</li>
        <li><strong>Frameworks de pruebas:</strong> Crear objetos de prueba con ciertas características predefinidas.</li>
        <li><strong>Editores de documentos:</strong> Duplicar elementos como secciones, páginas o componentes con sus propiedades.</li>
        <li><strong>Herramientas de modelado 3D:</strong> Duplicar objetos 3D y sus propiedades sin recrearlos desde cero.</li>
        <li><strong>IDEs:</strong> Duplicar fragmentos de código o archivos con sus configuraciones.</li>
        <li><strong>CMS:</strong> Clonar páginas o contenido completo en sistemas de gestión de contenido.</li>
      </ul>
      
      <h3>Prototype vs otros patrones creacionales</h3>
      <ul>
        <li><strong>Prototype vs Factory Method:</strong> Prototype crea nuevos objetos copiando un objeto existente, mientras Factory Method utiliza herencia y depende de una subclase para especificar el objeto a crear. Prototype es más flexible en tiempo de ejecución.</li>
        <li><strong>Prototype vs Builder:</strong> Builder construye objetos complejos paso a paso con múltiples métodos, mientras Prototype crea objetos copiando un prototipo completamente configurado. Builder se enfoca en el proceso de construcción, Prototype en la clonación.</li>
        <li><strong>Prototype vs Abstract Factory:</strong> Abstract Factory crea familias de objetos relacionados sin especificar sus clases concretas. Prototype se enfoca en clonar objetos existentes. Abstract Factory suele ser más rígido en su estructura.</li>
        <li><strong>Prototype vs Singleton:</strong> Singleton garantiza una única instancia, mientras Prototype se enfoca en crear múltiples instancias basadas en un original. Son casi opuestos en su objetivo: restricción vs. replicación.</li>
        <li><strong>Prototype vs Memento:</strong> Ambos tratan con copias de estado, pero Memento guarda el estado para restaurar el objeto original posteriormente, mientras Prototype crea nuevos objetos independientes.</li>
      </ul>
    `
  }
};

export default prototypePattern;
