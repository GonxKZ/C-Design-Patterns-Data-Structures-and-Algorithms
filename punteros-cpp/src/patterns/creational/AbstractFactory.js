/**
 * Abstract Factory - Patrón Creacional
 * 
 * Proporciona una interfaz para crear familias de objetos relacionados 
 * o dependientes sin especificar sus clases concretas.
 */

const abstractFactory = {
  id: 'abstract-factory',
  name: "Abstract Factory",
  category: "creational",
  description: "Proporciona una interfaz para crear familias de objetos relacionados o dependientes sin especificar sus clases concretas.",
  
  theory: {
    background: 'El patrón Abstract Factory se centra en la creación de objetos que pertenecen a familias conceptualmente relacionadas.',
    problem: 'Un sistema debe ser independiente de cómo se crean, componen y representan sus productos. Y debe ser configurado con una de múltiples familias de productos.',
    solution: 'Declarar interfaces para cada tipo distinto de producto, luego implementar variantes concretas de esas interfaces para cada familia. Finalmente, crear un "Fábrica Abstracta" que entregue objetos de todos los tipos.',
    applicability: [
      "Cuando un sistema debe ser independiente de cómo se crean, componen y representan sus productos",
      "Cuando un sistema debe ser configurado con una de múltiples familias de productos",
      "Cuando una familia de productos está diseñada para usarse juntos, y esta restricción debe ser impuesta",
      "Cuando se quiere proporcionar una biblioteca de productos y sólo se quieren revelar las interfaces, no las implementaciones"
    ],
    consequences: [
      "Aísla las clases concretas, controlando lo que se crea",
      "Facilita el intercambio de familias de productos",
      "Promueve la consistencia entre productos",
      "Dificulta la adición de nuevos tipos de productos, ya que la interfaz de la fábrica abstracta necesitaría modificarse"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `// Interfaces de Productos
class AbstractProductA {
public:
    virtual ~AbstractProductA() {}
    virtual std::string OperationA() const = 0;
};

class AbstractProductB {
public:
    virtual ~AbstractProductB() {}
    virtual std::string OperationB() const = 0;
    virtual std::string AnotherOperationB(const AbstractProductA& collaborator) const = 0;
};

// Productos Concretos - Familia 1
class ConcreteProductA1 : public AbstractProductA {
public:
    std::string OperationA() const override {
        return "Resultado de ProductA1";
    }
};

class ConcreteProductB1 : public AbstractProductB {
public:
    std::string OperationB() const override {
        return "Resultado de ProductB1";
    }
    
    std::string AnotherOperationB(const AbstractProductA& collaborator) const override {
        const std::string result = collaborator.OperationA();
        return "Resultado de B1 colaborando con (" + result + ")";
    }
};

// Productos Concretos - Familia 2
class ConcreteProductA2 : public AbstractProductA {
public:
    std::string OperationA() const override {
        return "Resultado de ProductA2";
    }
};

class ConcreteProductB2 : public AbstractProductB {
public:
    std::string OperationB() const override {
        return "Resultado de ProductB2";
    }
    
    std::string AnotherOperationB(const AbstractProductA& collaborator) const override {
        const std::string result = collaborator.OperationA();
        return "Resultado de B2 colaborando con (" + result + ")";
    }
};

// La interfaz Abstract Factory
class AbstractFactory {
public:
    virtual ~AbstractFactory() {}
    virtual AbstractProductA* CreateProductA() const = 0;
    virtual AbstractProductB* CreateProductB() const = 0;
};

// Fábricas Concretas
class ConcreteFactory1 : public AbstractFactory {
public:
    AbstractProductA* CreateProductA() const override {
        return new ConcreteProductA1();
    }
    
    AbstractProductB* CreateProductB() const override {
        return new ConcreteProductB1();
    }
};

class ConcreteFactory2 : public AbstractFactory {
public:
    AbstractProductA* CreateProductA() const override {
        return new ConcreteProductA2();
    }
    
    AbstractProductB* CreateProductB() const override {
        return new ConcreteProductB2();
    }
};

// Código Cliente
void ClientCode(const AbstractFactory& factory) {
    AbstractProductA* product_a = factory.CreateProductA();
    AbstractProductB* product_b = factory.CreateProductB();
    
    std::cout << product_b->OperationB() << "\\n";
    std::cout << product_b->AnotherOperationB(*product_a) << "\\n";
    
    delete product_a;
    delete product_b;
}

int main() {
    std::cout << "Cliente: Probando código cliente con la primera fábrica:\\n";
    ConcreteFactory1* f1 = new ConcreteFactory1();
    ClientCode(*f1);
    delete f1;
    
    std::cout << "\\nCliente: Probando el mismo código cliente con la segunda fábrica:\\n";
    ConcreteFactory2* f2 = new ConcreteFactory2();
    ClientCode(*f2);
    delete f2;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para los productos de tipo A." },
        { line: 6, text: "Definimos interfaces para los productos de tipo B, incluyendo un método que acepta un ProductA, para mostrar como los productos colaboran." },
        { line: 14, text: "Implementación concreta de ProductA para la familia 1." },
        { line: 21, text: "Implementación concreta de ProductB para la familia 1." },
        { line: 27, text: "Este método muestra cómo los productos de una misma familia están diseñados para trabajar juntos." },
        { line: 33, text: "Implementación concreta de ProductA para la familia 2." },
        { line: 40, text: "Implementación concreta de ProductB para la familia 2." },
        { line: 46, text: "De nuevo, los productos de una familia colaboran, pero con comportamiento específico de la familia 2." },
        { line: 52, text: "La interfaz AbstractFactory declara métodos para crear cada tipo de producto." },
        { line: 59, text: "Implementación concreta de la Fábrica para crear productos de la familia 1." },
        { line: 61, text: "Método para crear ProductA de la familia 1." },
        { line: 65, text: "Método para crear ProductB de la familia 1." },
        { line: 70, text: "Implementación concreta de la Fábrica para crear productos de la familia 2." },
        { line: 81, text: "El código cliente recibe una fábrica y utiliza los productos que crea." },
        { line: 82, text: "El cliente crea ProductA a través de la fábrica, sin conocer la clase concreta." },
        { line: 83, text: "El cliente crea ProductB a través de la fábrica, sin conocer la clase concreta." },
        { line: 85, text: "Usa los productos creados, que están diseñados para trabajar juntos." },
        { line: 93, text: "Creación de la primera fábrica concreta." },
        { line: 94, text: "El mismo código cliente puede trabajar con cualquier fábrica concreta." },
        { line: 98, text: "Creación de la segunda fábrica concreta." },
        { line: 99, text: "El mismo código cliente funciona con la segunda fábrica, obteniendo productos compatibles de la segunda familia." }
      ]
    },
    cppModern: {
      code: `// Interfaces de Productos
class AbstractProductA {
public:
    virtual ~AbstractProductA() = default;
    virtual std::string OperationA() const = 0;
};

class AbstractProductB {
public:
    virtual ~AbstractProductB() = default;
    virtual std::string OperationB() const = 0;
    virtual std::string AnotherOperationB(const AbstractProductA& collaborator) const = 0;
};

// Productos Concretos - Familia 1
class ConcreteProductA1 : public AbstractProductA {
public:
    std::string OperationA() const override {
        return "Resultado de ProductA1";
    }
};

class ConcreteProductB1 : public AbstractProductB {
public:
    std::string OperationB() const override {
        return "Resultado de ProductB1";
    }
    
    std::string AnotherOperationB(const AbstractProductA& collaborator) const override {
        const std::string result = collaborator.OperationA();
        return "Resultado de B1 colaborando con (" + result + ")";
    }
};

// Productos Concretos - Familia 2
class ConcreteProductA2 : public AbstractProductA {
public:
    std::string OperationA() const override {
        return "Resultado de ProductA2";
    }
};

class ConcreteProductB2 : public AbstractProductB {
public:
    std::string OperationB() const override {
        return "Resultado de ProductB2";
    }
    
    std::string AnotherOperationB(const AbstractProductA& collaborator) const override {
        const std::string result = collaborator.OperationA();
        return "Resultado de B2 colaborando con (" + result + ")";
    }
};

// La interfaz Abstract Factory usando memoria inteligente
class AbstractFactory {
public:
    virtual ~AbstractFactory() = default;
    virtual std::unique_ptr<AbstractProductA> CreateProductA() const = 0;
    virtual std::unique_ptr<AbstractProductB> CreateProductB() const = 0;
};

// Fábricas Concretas
class ConcreteFactory1 : public AbstractFactory {
public:
    std::unique_ptr<AbstractProductA> CreateProductA() const override {
        return std::make_unique<ConcreteProductA1>();
    }
    
    std::unique_ptr<AbstractProductB> CreateProductB() const override {
        return std::make_unique<ConcreteProductB1>();
    }
};

class ConcreteFactory2 : public AbstractFactory {
public:
    std::unique_ptr<AbstractProductA> CreateProductA() const override {
        return std::make_unique<ConcreteProductA2>();
    }
    
    std::unique_ptr<AbstractProductB> CreateProductB() const override {
        return std::make_unique<ConcreteProductB2>();
    }
};

// Código Cliente
void ClientCode(const AbstractFactory& factory) {
    auto product_a = factory.CreateProductA();
    auto product_b = factory.CreateProductB();
    
    std::cout << product_b->OperationB() << "\\n";
    std::cout << product_b->AnotherOperationB(*product_a) << "\\n";
    
    // No es necesario delete, los smart pointers liberan automáticamente la memoria
}

int main() {
    std::cout << "Cliente: Probando código cliente con la primera fábrica:\\n";
    auto f1 = std::make_unique<ConcreteFactory1>();
    ClientCode(*f1);
    
    std::cout << "\\nCliente: Probando el mismo código cliente con la segunda fábrica:\\n";
    auto f2 = std::make_unique<ConcreteFactory2>();
    ClientCode(*f2);
    
    return 0;
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para los productos de tipo A." },
        { line: 4, text: "Usando '= default' para el destructor, una característica moderna de C++." },
        { line: 5, text: "Método virtual puro que las clases concretas deben implementar." },
        { line: 9, text: "Usando '= default' para el destructor de AbstractProductB." },
        { line: 14, text: "Implementación concreta de ProductA para la familia 1." },
        { line: 21, text: "Implementación concreta de ProductB para la familia 1." },
        { line: 27, text: "Este método muestra cómo los productos de una misma familia están diseñados para trabajar juntos." },
        { line: 33, text: "Implementación concreta de ProductA para la familia 2." },
        { line: 40, text: "Implementación concreta de ProductB para la familia 2." },
        { line: 52, text: "La interfaz AbstractFactory declara métodos para crear cada tipo de producto, usando std::unique_ptr para gestión automática de memoria." },
        { line: 59, text: "Implementación concreta de la Fábrica para crear productos de la familia 1." },
        { line: 61, text: "Método para crear ProductA de la familia 1, usando std::make_unique para creación y gestión segura de memoria." },
        { line: 65, text: "Método para crear ProductB de la familia 1, también con gestión automática de memoria." },
        { line: 70, text: "Implementación concreta de la Fábrica para crear productos de la familia 2." },
        { line: 81, text: "El código cliente recibe una fábrica y utiliza los productos que crea." },
        { line: 82, text: "Usando 'auto' para inferencia de tipo y smart pointers para la gestión automática de memoria." },
        { line: 86, text: "Usando los productos creados, que están diseñados para trabajar juntos." },
        { line: 89, text: "No es necesario liberar memoria manualmente, los unique_ptr se encargan de ello cuando salen de ámbito." },
        { line: 93, text: "Creación de la primera fábrica concreta, usando std::make_unique." },
        { line: 97, text: "Creación de la segunda fábrica concreta, con gestión automática de memoria." }
      ]
    },
    java: {
      code: `// Interfaces de Productos
interface AbstractProductA {
    String operationA();
}

interface AbstractProductB {
    String operationB();
    String anotherOperationB(AbstractProductA collaborator);
}

// Productos Concretos - Familia 1
class ConcreteProductA1 implements AbstractProductA {
    @Override
    public String operationA() {
        return "Resultado de ProductA1";
    }
}

class ConcreteProductB1 implements AbstractProductB {
    @Override
    public String operationB() {
        return "Resultado de ProductB1";
    }

    @Override
    public String anotherOperationB(AbstractProductA collaborator) {
        String result = collaborator.operationA();
        return "Resultado de B1 colaborando con (" + result + ")";
    }
}

// Productos Concretos - Familia 2
class ConcreteProductA2 implements AbstractProductA {
    @Override
    public String operationA() {
        return "Resultado de ProductA2";
    }
}

class ConcreteProductB2 implements AbstractProductB {
    @Override
    public String operationB() {
        return "Resultado de ProductB2";
    }

    @Override
    public String anotherOperationB(AbstractProductA collaborator) {
        String result = collaborator.operationA();
        return "Resultado de B2 colaborando con (" + result + ")";
    }
}

// La interfaz Abstract Factory
interface AbstractFactory {
    AbstractProductA createProductA();
    AbstractProductB createProductB();
}

// Fábricas Concretas
class ConcreteFactory1 implements AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA1();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 implements AbstractFactory {
    @Override
    public AbstractProductA createProductA() {
        return new ConcreteProductA2();
    }

    @Override
    public AbstractProductB createProductB() {
        return new ConcreteProductB2();
    }
}

// Código Cliente
class Client {
    private AbstractProductA productA;
    private AbstractProductB productB;

    // Constructor que recibe una fábrica
    public Client(AbstractFactory factory) {
        productA = factory.createProductA();
        productB = factory.createProductB();
    }

    public void execute() {
        System.out.println(productB.operationB());
        System.out.println(productB.anotherOperationB(productA));
    }
}

public class AbstractFactoryDemo {
    public static void main(String[] args) {
        System.out.println("Cliente: Probando con la primera fábrica:");
        Client client1 = new Client(new ConcreteFactory1());
        client1.execute();

        System.out.println("\\nCliente: Probando con la segunda fábrica:");
        Client client2 = new Client(new ConcreteFactory2());
        client2.execute();
    }
}`,
      explanation: [
        { line: 1, text: "Definimos interfaces para los productos. En Java usamos la palabra clave 'interface'." },
        { line: 5, text: "Interfaz para los productos de tipo B, incluyendo un método que acepta ProductA como colaborador." },
        { line: 11, text: "Implementación concreta de ProductA para la familia 1. Utilizamos 'implements' en lugar de 'extends'." },
        { line: 18, text: "Implementación concreta de ProductB para la familia 1." },
        { line: 24, text: "Método que muestra la colaboración entre productos de la misma familia." },
        { line: 30, text: "Implementación concreta de ProductA para la familia 2." },
        { line: 37, text: "Implementación concreta de ProductB para la familia 2." },
        { line: 48, text: "La interfaz AbstractFactory declara métodos para crear cada tipo de producto." },
        { line: 49, text: "En Java, por convención, usamos 'create' en lugar de 'Create' para los nombres de métodos." },
        { line: 54, text: "Implementación concreta de la fábrica para la familia 1." },
        { line: 56, text: "Método que crea una instancia de ProductA de la familia 1." },
        { line: 66, text: "Implementación concreta de la fábrica para la familia 2." },
        { line: 77, text: "En Java, implementamos el código cliente como una clase con estado." },
        { line: 81, text: "El constructor recibe una fábrica y crea los productos usando esa fábrica." },
        { line: 86, text: "Método que utiliza los productos creados, que están diseñados para trabajar juntos." },
        { line: 92, text: "Clase principal con método main para ejecutar el demo." },
        { line: 94, text: "Crear un cliente con la primera fábrica concreta." },
        { line: 98, text: "Crear otro cliente con la segunda fábrica concreta." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Interfaces y Objetos',
      cppTraditional: 'Usa clases abstractas y herencia para definir interfaces. Usa punteros y requiere gestión manual de memoria.',
      cppModern: 'Usa clases abstractas con smart pointers (std::unique_ptr) para gestión automática de memoria.',
      java: 'Usa interfaces explícitas (keyword interface) y polimorfismo. La gestión de memoria es manejada por el recolector de basura.'
    },
    {
      title: 'Creación de Objetos',
      cppTraditional: 'Usa el operador new para asignación dinámica y requiere delete para liberar memoria.',
      cppModern: 'Usa std::make_unique para crear objetos con gestión automática de memoria.',
      java: 'Simplemente usa new. No es necesario preocuparse por la liberación de memoria.'
    },
    {
      title: 'Métodos de Fábrica',
      cppTraditional: 'Retorna punteros crudos (raw pointers) a objetos creados dinámicamente.',
      cppModern: 'Retorna smart pointers para gestión segura y automática de memoria.',
      java: 'Retorna referencias a objetos, cuya memoria es gestionada por el recolector de basura.'
    },
    {
      title: 'Código Cliente',
      cppTraditional: 'Es responsable de liberar la memoria asignada a los productos.',
      cppModern: 'No necesita preocuparse por la gestión de memoria gracias a los smart pointers.',
      java: 'Utiliza objetos sin preocuparse por liberación de memoria. Implementado como una clase completa.'
    }
  ],
  
  notes: 'Abstract Factory es especialmente útil cuando un sistema debe trabajar con múltiples familias de productos relacionados. A diferencia del patrón Factory Method, que se centra en crear un solo tipo de objeto mediante herencia, Abstract Factory crea familias enteras de objetos relacionados a través de composición. Es excelente para situaciones donde los productos deben estar asegurados de ser compatibles entre sí, como en sistemas que deben adaptarse a diferentes apariencias o comportamientos dependiendo del entorno o configuración. Un desafío del patrón es que añadir nuevos tipos de productos es difícil, ya que requiere modificar la interfaz de la fábrica abstracta y todas sus implementaciones.'
};

export default abstractFactory;
