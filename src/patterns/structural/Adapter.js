// Implementación del patrón Adapter con explicaciones detalladas
// Este patrón permite que interfaces incompatibles trabajen juntas

export const adapterPattern = {
  id: 'adapter',
  category: 'structural',
  name: 'Adapter',
  description: 'Convierte la interfaz de una clase en otra interfaz que los clientes esperan. El patrón Adapter permite que clases con interfaces incompatibles trabajen juntas, actuando como un puente entre ellas.',
  implementations: {
    cppTraditional: {
      code: `// La interfaz objetivo que el cliente espera usar
class Target {
public:
    virtual ~Target() {}
    virtual std::string request() const = 0;
};

// Clase existente con interfaz incompatible
class Adaptee {
public:
    std::string specificRequest() const {
        return "Respuesta específica del Adaptee";
    }
};

// Adaptador que hace compatible Adaptee con la interfaz Target
class Adapter : public Target {
private:
    Adaptee* adaptee_;

public:
    Adapter(Adaptee* adaptee) : adaptee_(adaptee) {}
    
    ~Adapter() {
        // No eliminamos adaptee_ aquí porque podría ser utilizado en otro lugar
    }
    
    std::string request() const override {
        // Convertimos la llamada a request() en una llamada a specificRequest()
        std::string result = adaptee_->specificRequest();
        return "Adapter: (TRADUCIDO) " + result;
    }
};

// Código cliente
void clientCode(const Target* target) {
    std::cout << target->request() << std::endl;
}

int main() {
    // Trabajando con Target directamente
    std::cout << "Cliente: Puedo trabajar bien con objetos Target:" << std::endl;
    Target* target = new ConcreteTarget();
    clientCode(target);
    delete target;
    
    std::cout << std::endl;
    
    // Adaptee existente
    Adaptee* adaptee = new Adaptee();
    std::cout << "Cliente: La clase Adaptee tiene una interfaz incompatible:" << std::endl;
    std::cout << "Adaptee: " << adaptee->specificRequest() << std::endl;
    
    std::cout << std::endl;
    
    // Adaptando Adaptee a través del Adapter
    std::cout << "Cliente: Pero con el Adapter puedo usar Adaptee:" << std::endl;
    Target* adapter = new Adapter(adaptee);
    clientCode(adapter);
    
    // Limpieza de memoria
    delete adapter;
    delete adaptee;
    
    return 0;
}`,
      explanation: [
        { line: 2, text: "Definimos la interfaz Target que el cliente espera utilizar." },
        { line: 4, text: "Destructor virtual para garantizar limpieza correcta de clases derivadas." },
        { line: 5, text: "Método virtual puro que las subclases deben implementar." },
        { line: 9, text: "Clase existente con una interfaz incompatible que queremos adaptar." },
        { line: 11, text: "Método específico que no coincide con la interfaz que el cliente espera." },
        { line: 16, text: "Clase Adapter que hereda de Target e 'incluye' un Adaptee." },
        { line: 18, text: "Puntero al objeto Adaptee que vamos a adaptar." },
        { line: 21, text: "Constructor que recibe un puntero al Adaptee." },
        { line: 23, text: "Destructor que no libera adaptee_ para evitar problemas si se usa en otro lugar." },
        { line: 27, text: "Implementación del método request() requerido por la interfaz Target." },
        { line: 29, text: "Convertimos la llamada a request() en una llamada a specificRequest() de Adaptee." },
        { line: 35, text: "Código cliente que trabaja con cualquier objeto que implemente la interfaz Target." },
        { line: 39, text: "Función principal para demostrar el patrón." },
        { line: 42, text: "Creación de un Target concreto." },
        { line: 43, text: "Uso normal de un objeto Target." },
        { line: 48, text: "Creación de un objeto Adaptee." },
        { line: 53, text: "Creación de un Adapter que envuelve al Adaptee." },
        { line: 54, text: "El cliente usa el adaptador como si fuera un Target." },
        { line: 58, text: "Liberación manual de memoria." }
      ]
    },
    cppModern: {
      code: `// La interfaz objetivo que el cliente espera usar
class Target {
public:
    virtual ~Target() = default;
    virtual std::string request() const = 0;
};

// Clase existente con interfaz incompatible
class Adaptee {
public:
    std::string specificRequest() const {
        return "Respuesta específica del Adaptee";
    }
};

// Adaptador que hace compatible Adaptee con la interfaz Target
class Adapter : public Target {
private:
    std::shared_ptr<Adaptee> adaptee_; // Uso de puntero inteligente

public:
    Adapter(std::shared_ptr<Adaptee> adaptee) : adaptee_(adaptee) {}
    
    // No es necesario un destructor explícito gracias a shared_ptr
    
    std::string request() const override {
        // Convertimos la llamada a request() en una llamada a specificRequest()
        std::string result = adaptee_->specificRequest();
        return "Adapter: (TRADUCIDO) " + result;
    }
};

// Código cliente
void clientCode(const std::shared_ptr<Target>& target) {
    std::cout << target->request() << std::endl;
}

int main() {
    // Trabajando con Target directamente
    std::cout << "Cliente: Puedo trabajar bien con objetos Target:" << std::endl;
    auto target = std::make_shared<ConcreteTarget>();
    clientCode(target);
    
    std::cout << std::endl;
    
    // Adaptee existente
    auto adaptee = std::make_shared<Adaptee>();
    std::cout << "Cliente: La clase Adaptee tiene una interfaz incompatible:" << std::endl;
    std::cout << "Adaptee: " << adaptee->specificRequest() << std::endl;
    
    std::cout << std::endl;
    
    // Adaptando Adaptee a través del Adapter
    std::cout << "Cliente: Pero con el Adapter puedo usar Adaptee:" << std::endl;
    auto adapter = std::make_shared<Adapter>(adaptee);
    clientCode(adapter);
    
    // No es necesario liberar memoria explícitamente
    
    return 0;
}`,
      explanation: [
        { line: 2, text: "Definimos la interfaz Target que el cliente espera utilizar." },
        { line: 4, text: "Destructor virtual con = default, una característica de C++11." },
        { line: 9, text: "Clase existente con una interfaz incompatible que queremos adaptar." },
        { line: 16, text: "Clase Adapter que hereda de Target." },
        { line: 18, text: "Usamos std::shared_ptr para gestionar automáticamente la memoria del Adaptee." },
        { line: 21, text: "Constructor que recibe un shared_ptr al Adaptee." },
        { line: 23, text: "No es necesario un destructor explícito ya que shared_ptr libera la memoria automáticamente." },
        { line: 25, text: "Implementación del método request() requerido por la interfaz Target." },
        { line: 32, text: "Código cliente que ahora recibe un shared_ptr en lugar de un puntero crudo." },
        { line: 36, text: "Función principal para demostrar el patrón." },
        { line: 39, text: "Uso de std::make_shared para crear objetos de manera segura." },
        { line: 46, text: "Creación de un objeto Adaptee usando std::make_shared." },
        { line: 52, text: "Creación de un Adapter que envuelve al Adaptee usando punteros inteligentes." },
        { line: 55, text: "No es necesario liberar memoria explícitamente, los shared_ptr se encargan de ello." }
      ]
    },
    java: {
      code: `// La interfaz objetivo que el cliente espera usar
interface Target {
    String request();
}

// Implementación concreta de Target
class ConcreteTarget implements Target {
    @Override
    public String request() {
        return "Target: El comportamiento predeterminado de Target.";
    }
}

// Clase existente con interfaz incompatible
class Adaptee {
    public String specificRequest() {
        return "Respuesta específica del Adaptee";
    }
}

// Adaptador que hace compatible Adaptee con la interfaz Target
class Adapter implements Target {
    private final Adaptee adaptee;

    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public String request() {
        // Convertimos la llamada a request() en una llamada a specificRequest()
        String result = adaptee.specificRequest();
        return "Adapter: (TRADUCIDO) " + result;
    }
}

// Demostración del patrón
public class AdapterDemo {
    // Código cliente
    private static void clientCode(Target target) {
        System.out.println(target.request());
    }

    public static void main(String[] args) {
        // Trabajando con Target directamente
        System.out.println("Cliente: Puedo trabajar bien con objetos Target:");
        Target target = new ConcreteTarget();
        clientCode(target);

        System.out.println();

        // Adaptee existente
        Adaptee adaptee = new Adaptee();
        System.out.println("Cliente: La clase Adaptee tiene una interfaz incompatible:");
        System.out.println("Adaptee: " + adaptee.specificRequest());

        System.out.println();

        // Adaptando Adaptee a través del Adapter
        System.out.println("Cliente: Pero con el Adapter puedo usar Adaptee:");
        Target adapter = new Adapter(adaptee);
        clientCode(adapter);
    }
}`,
      explanation: [
        { line: 2, text: "Definimos la interfaz Target que el cliente espera utilizar." },
        { line: 6, text: "Implementación concreta de la interfaz Target." },
        { line: 13, text: "Clase existente con una interfaz incompatible que queremos adaptar." },
        { line: 19, text: "Clase Adapter que implementa Target (en Java usamos implements en lugar de herencia)." },
        { line: 20, text: "Referencia al objeto Adaptee. Usamos 'final' para indicar que no cambiará después de la inicialización." },
        { line: 22, text: "Constructor que recibe un Adaptee." },
        { line: 27, text: "Implementación del método request() requerido por la interfaz Target." },
        { line: 29, text: "Convertimos la llamada a request() en una llamada a specificRequest() de Adaptee." },
        { line: 35, text: "Clase de demostración con el código cliente." },
        { line: 37, text: "Método cliente que trabaja con cualquier objeto que implemente la interfaz Target." },
        { line: 41, text: "Método principal para demostrar el patrón." },
        { line: 44, text: "Creación de un Target concreto." },
        { line: 50, text: "Creación de un objeto Adaptee." },
        { line: 56, text: "Creación de un Adapter que envuelve al Adaptee." },
        { line: 57, text: "El cliente usa el adaptador como si fuera un Target." }
      ]
    }
  },
  theory: {
    background: 'El patrón Adapter fue documentado por la Banda de los Cuatro (GoF) y su concepto proviene de la vida cotidiana, donde utilizamos adaptadores para conectar dispositivos con interfaces incompatibles, como un adaptador eléctrico para diferentes tipos de enchufes. En software, resuelve problemas similares cuando necesitamos integrar componentes con interfaces distintas.',
    
    problem: 'Cuando queremos utilizar una clase existente, pero su interfaz no coincide con la que necesitamos, nos enfrentamos a un problema de incompatibilidad. Por ejemplo, cuando integramos bibliotecas de terceros, marcos de trabajo heredados o componentes con diferentes estándares. Reescribir estas clases no es práctico y a menudo imposible si no tenemos acceso al código fuente.',
    
    solution: 'El patrón Adapter resuelve esto creando una clase intermedia (el adaptador) que traduce las llamadas de una interfaz a otra. El adaptador implementa la interfaz que el cliente espera y mantiene una referencia al objeto adaptado, delegando en él las operaciones pero con la interfaz transformada.',
    
    applicability: [
      'Cuando quieres usar una clase existente, pero su interfaz no coincide con la que necesitas',
      'Cuando necesitas integrar clases que no fueron diseñadas para trabajar juntas, especialmente de terceros o sistemas heredados',
      'Para reutilizar código existente en un nuevo sistema con interfaces diferentes',
      'Para crear una clase reutilizable que coopere con clases de interfaces no relacionadas o desconocidas',
      'Para convertir datos entre diferentes formatos o estándares'
    ],
    
    consequences: [
      'Permite que clases con interfaces incompatibles trabajen juntas',
      'Promueve la reutilización de clases existentes, incluso cuando no fueron diseñadas inicialmente para el nuevo sistema',
      'Introduce una capa adicional de indirección que puede afectar al rendimiento',
      'Puede aumentar la complejidad del código si requiere mantener y entender múltiples adaptadores',
      'Facilita la migración gradual de sistemas heredados a nuevas arquitecturas'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Adapter?</h3>
      <ul>
        <li><strong>Integración de sistemas:</strong> Cuando necesitas integrar componentes nuevos con sistemas existentes que tienen interfaces incompatibles.</li>
        <li><strong>Uso de bibliotecas externas:</strong> Cuando incorporas una biblioteca de terceros cuya interfaz no encaja con el diseño de tu aplicación.</li>
        <li><strong>Migración de sistemas:</strong> Durante migraciones por fases, donde el sistema antiguo y el nuevo deben coexistir temporalmente.</li>
        <li><strong>APIs incompatibles:</strong> Cuando trabajas con múltiples APIs que realizan funciones similares pero con interfaces diferentes.</li>
        <li><strong>Cambios de requisitos:</strong> Cuando la interfaz existente no puede modificarse, pero debe adaptarse a nuevos requisitos.</li>
      </ul>
      
      <h3>Tipos de Adaptadores:</h3>
      <ul>
        <li><strong>Adaptador de clase (usando herencia):</strong> Hereda de la clase objetivo e implementa la interfaz que se espera. Solo es posible en lenguajes con herencia múltiple.</li>
        <li><strong>Adaptador de objeto (usando composición):</strong> Implementa la interfaz esperada y mantiene una referencia al objeto adaptado. Más flexible y preferible en la mayoría de los casos.</li>
        <li><strong>Adaptador bidireccional:</strong> Permite la comunicación en ambas direcciones, adaptando cada interfaz a la otra según sea necesario.</li>
        <li><strong>Adaptador con funcionalidad extendida:</strong> No solo adapta, sino que añade funcionalidad adicional al componente adaptado.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Adaptadores de datos:</strong> Convertir entre formatos XML, JSON, CSV u otros formatos de intercambio de datos.</li>
        <li><strong>Adaptadores de persistencia:</strong> Conectar distintos ORM o sistemas de base de datos a una aplicación con una interfaz de repositorio unificada.</li>
        <li><strong>Frameworks gráficos:</strong> Adaptar diferentes bibliotecas de renderizado a una interfaz común en motores de juegos o aplicaciones gráficas.</li>
        <li><strong>Adaptadores de redes sociales:</strong> Proporcionar una interfaz unificada para interactuar con diferentes APIs de redes sociales (Twitter, Facebook, etc.).</li>
        <li><strong>Adaptadores de pago:</strong> Crear una interfaz común para diferentes pasarelas de pago (PayPal, Stripe, etc.).</li>
        <li><strong>Wrappers de APIs antiguas:</strong> Modernizar interfaces de APIs obsoletas sin reescribir el código cliente.</li>
      </ul>
      
      <h3>Adapter vs Bridge vs Facade vs Proxy</h3>
      <ul>
        <li><strong>Adapter:</strong> Hace que interfaces incompatibles trabajen juntas. Se aplica después del diseño del sistema.</li>
        <li><strong>Bridge:</strong> Separa una abstracción de su implementación para que ambas puedan variar independientemente. Se diseña desde el principio.</li>
        <li><strong>Facade:</strong> Proporciona una interfaz unificada y simplificada a un conjunto de interfaces en un subsistema. Simplifica, no adapta.</li>
        <li><strong>Proxy:</strong> Proporciona un sustituto o representante de otro objeto para controlar el acceso a éste. Misma interfaz, control de acceso.</li>
      </ul>
    `
  },
  comparisons: [
    {
      title: "Gestión de memoria",
      cppTraditional: "Gestión manual de memoria con delete para evitar fugas de memoria.",
      cppModern: "Uso de punteros inteligentes (shared_ptr) que administran automáticamente la memoria.",
      java: "No requiere gestión manual de memoria gracias al recolector de basura."
    },
    {
      title: "Diseño de la interfaz",
      cppTraditional: "Usa herencia pública y métodos virtuales para definir la interfaz.",
      cppModern: "Similar al tradicional pero con sintaxis moderna (= default, etc.).",
      java: "Usa interfaces explícitas con la palabra clave 'interface'."
    },
    {
      title: "Seguridad de tipos",
      cppTraditional: "Propenso a errores por punteros crudos (raw pointers).",
      cppModern: "Mayor seguridad gracias a punteros inteligentes que evitan punteros nulos y fugas.",
      java: "Mayor seguridad por verificación de tipos en tiempo de compilación y ejecución."
    },
    {
      title: "Sintaxis",
      cppTraditional: "Requiere gestión explícita de la memoria y uso de punteros.",
      cppModern: "Más limpia y segura con características como std::make_shared y auto.",
      java: "Más simple, sin punteros explícitos y con interfaces bien definidas."
    }
  ],
  notes: "El patrón Adapter es particularmente útil cuando se trabaja con bibliotecas de terceros o código heredado que no podemos modificar. En C++, existen dos variantes principales: el adaptador de clase (usando herencia múltiple) y el adaptador de objeto (usando composición), siendo este último el más común y flexible."
};
