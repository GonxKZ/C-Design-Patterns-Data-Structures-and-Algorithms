// Implementación del patrón Adapter con explicaciones detalladas
// Este patrón permite que interfaces incompatibles trabajen juntas

export const adapterPattern = {
  id: 'adapter',
  category: 'structural',
  name: 'Adapter',
  description: 'Permite que interfaces incompatibles trabajen juntas convirtiendo la interfaz de una clase en otra interfaz que los clientes esperan.',
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
    background: "El patrón Adapter es un patrón estructural que permite la colaboración entre objetos con interfaces incompatibles. Es especialmente útil cuando se trabaja con bibliotecas de terceros o código heredado que no podemos modificar directamente.",
    problem: "¿Cómo podemos hacer que una clase existente funcione con otros sin modificar su código fuente? Por ejemplo, cuando tenemos una aplicación que espera cierta interfaz, pero necesitamos usar una clase o biblioteca que tiene una interfaz diferente.",
    solution: "El patrón Adapter resuelve este problema al crear una clase intermedia (el Adaptador) que convierte la interfaz de una clase existente en la interfaz que el cliente espera.",
    applicability: [
      "Cuando quieres usar una clase existente pero su interfaz no coincide con la que necesitas",
      "Cuando necesitas reutilizar varias subclases existentes pero no quieres añadir código duplicado",
      "Cuando quieres crear una clase reutilizable que coopere con clases que tienen interfaces incompatibles"
    ],
    consequences: [
      "Permite que clases con interfaces incompatibles trabajen juntas",
      "Promueve la reutilización de código existente",
      "Aumenta la flexibilidad del código",
      "Puede añadir una pequeña sobrecarga por la indirección adicional",
      "En C++ tradicional, hay que ser cuidadoso con la gestión de memoria"
    ]
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
