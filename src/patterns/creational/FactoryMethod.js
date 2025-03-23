/**
 * Patrón Factory Method en JavaScript
 * Este archivo contiene la implementación del patrón Factory Method para ser importado
 * en la aplicación principal.
 */

const factoryMethodPattern = {
  id: 'factory-method',
  name: 'Factory Method',
  category: 'creational',
  description: 'Define una interfaz para crear objetos, pero permite a las subclases decidir qué clase instanciar. Permite que una clase delegue la responsabilidad de instanciación en sus subclases, facilitando la extensibilidad y el desacoplamiento entre creación y uso de objetos.',
  
  theory: {
    background: 'El patrón Factory Method es uno de los patrones creacionales fundamentales identificados por la Banda de los Cuatro (GoF). Evolucionó como una forma de permitir que los frameworks sean extensibles sin modificar el código base, siguiendo el principio de inversión de dependencias y el principio abierto/cerrado.',
    
    problem: 'Cómo puede una clase crear objetos cuyo tipo exacto no conoce de antemano, permitiendo que el sistema sea extensible sin modificar el código existente. Además, cómo minimizar el acoplamiento entre la lógica de creación y la lógica de negocio, evitando que el código cliente dependa directamente de clases concretas.',
    
    solution: 'El patrón Factory Method define un método abstracto en una clase base (llamado "método de fábrica") que las subclases implementan para crear objetos específicos. El código cliente llama a este método abstracto cuando necesita una instancia, pero sin conocer el tipo concreto de objeto que recibirá. La responsabilidad de decidir qué clase instanciar se delega a las subclases.',
    
    applicability: [
      'Cuando una clase no puede anticipar la clase de objetos que debe crear, pero quiere delegar la responsabilidad a sus subclases',
      'Cuando necesitas proporcionar a los usuarios una forma de extender los componentes internos de una biblioteca o framework',
      'Cuando quieres reutilizar objetos existentes en lugar de reconstruirlos cada vez (como en pools de objetos)',
      'Cuando la creación del objeto implica procesos complejos que deben ser centralizados y no repetidos en el código cliente',
      'Cuando el sistema debe ser independiente de cómo se crean, componen y representan sus productos'
    ],
    
    consequences: [
      'Elimina la necesidad de vincular el código de la aplicación a clases concretas específicas',
      'Facilita la incorporación de nuevas clases de productos sin cambiar el código existente',
      'Promueve la consistencia encapsulando la lógica de creación en un solo lugar',
      'Puede conducir a una jerarquía de clases más compleja con muchas subclases',
      'Aplica el principio de inversión de dependencias, dependiendo de abstracciones, no de implementaciones concretas'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Factory Method?</h3>
      <ul>
        <li><strong>Extensibilidad del sistema:</strong> Cuando necesitas que tu sistema pueda incorporar nuevos tipos de objetos sin modificar el código existente.</li>
        <li><strong>Frameworks y bibliotecas:</strong> Cuando desarrollas frameworks donde los usuarios deben poder extender la funcionalidad base.</li>
        <li><strong>Pruebas unitarias:</strong> Cuando necesitas sustituir implementaciones reales por objetos de prueba o simulaciones.</li>
        <li><strong>Complejidad en la creación:</strong> Cuando la creación de un objeto implica decisiones complejas, configuración específica o varios pasos.</li>
        <li><strong>Dependencia de contexto:</strong> Cuando la creación del objeto depende del entorno, configuración o estado del sistema.</li>
      </ul>
      
      <h3>Factory Method vs Abstract Factory vs Builder</h3>
      <ul>
        <li><strong>Factory Method:</strong> Se centra en crear un producto a través de herencia y subclases. Cada subclase decide qué clase concreta crear.</li>
        <li><strong>Abstract Factory:</strong> Proporciona una interfaz para crear familias de objetos relacionados sin especificar sus clases concretas. Utiliza composición en lugar de herencia.</li>
        <li><strong>Builder:</strong> Se enfoca en la construcción paso a paso de objetos complejos, separando la construcción de la representación, permitiendo diferentes representaciones mediante el mismo proceso.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Frameworks UI:</strong> Botones, ventanas y otros componentes adaptados a diferentes plataformas (Windows, macOS, web).</li>
        <li><strong>Conexiones de base de datos:</strong> Crear el conector adecuado según el tipo de base de datos (MySQL, PostgreSQL, MongoDB).</li>
        <li><strong>Motores de juegos:</strong> Creación de enemigos, obstáculos o niveles según el contexto del juego.</li>
        <li><strong>Parsers de documentos:</strong> Crear el parser correcto según el formato del documento (XML, JSON, CSV).</li>
        <li><strong>Frameworks de logging:</strong> Crear diferentes implementaciones de loggers según la configuración (archivo, consola, base de datos).</li>
        <li><strong>Sistemas de renderizado:</strong> Crear renderizadores adaptados a diferentes dispositivos o capacidades gráficas.</li>
      </ul>
      
      <h3>Variantes del patrón Factory Method:</h3>
      <ul>
        <li><strong>Método de fábrica simple:</strong> Una versión simplificada que no requiere herencia, sino que encapsula la creación en un método estático.</li>
        <li><strong>Método de fábrica parametrizado:</strong> Recibe un parámetro que determina qué tipo de objeto crear, como un enum o cadena identificativa.</li>
        <li><strong>Factory Method con registro:</strong> Permite registrar y desregistrar dinámicamente tipos de productos que el factory puede crear.</li>
        <li><strong>Lazy Factory:</strong> Crea e inicializa objetos solo cuando son necesarios por primera vez.</li>
      </ul>
    `
  },
  
  implementations: {
    cppTraditional: {
      code: `/**
 * La interfaz Product declara las operaciones que todos los productos concretos deben implementar.
 */
class Product {
public:
  virtual ~Product() {}
  virtual std::string Operation() const = 0;
};

/**
 * Los Productos Concretos proporcionan varias implementaciones de la interfaz Product.
 */
class ConcreteProduct1 : public Product {
public:
  std::string Operation() const override {
    return "{Resultado del ConcreteProduct1}";
  }
};

class ConcreteProduct2 : public Product {
public:
  std::string Operation() const override {
    return "{Resultado del ConcreteProduct2}";
  }
};

/**
 * La clase Creator declara el método fábrica que devuelve un objeto de la clase Product.
 * Las subclases de Creator normalmente proporcionan la implementación de este método.
 */
class Creator {
public:
  virtual ~Creator() {}
  virtual Product* FactoryMethod() const = 0;
  
  /**
   * La responsabilidad principal del Creator no es crear productos, sino contener la
   * lógica de negocio que depende de los objetos Product.
   */
  std::string SomeOperation() const {
    // Llama al método fábrica para crear un objeto Product.
    Product* product = this->FactoryMethod();
    
    // Usa el producto.
    std::string result = "Creator: El mismo código del creador ha trabajado con " + product->Operation();
    
    delete product; // Importante: liberar memoria en C++ tradicional
    return result;
  }
};

/**
 * Los Creadores Concretos sobrescriben el método fábrica para cambiar el tipo de producto resultante.
 */
class ConcreteCreator1 : public Creator {
public:
  Product* FactoryMethod() const override {
    return new ConcreteProduct1();
  }
};

class ConcreteCreator2 : public Creator {
public:
  Product* FactoryMethod() const override {
    return new ConcreteProduct2();
  }
};

/**
 * El código cliente trabaja con una instancia de un creador concreto, aunque a través
 * de su interfaz base.
 */
void ClientCode(const Creator& creator) {
  std::cout << "Client: No conozco la clase del creador, pero aún funciona.\\n"
            << creator.SomeOperation() << std::endl;
}

int main() {
  std::cout << "App: Iniciada con ConcreteCreator1.\\n";
  Creator* creator = new ConcreteCreator1();
  ClientCode(*creator);
  
  std::cout << "\\nApp: Iniciada con ConcreteCreator2.\\n";
  Creator* creator2 = new ConcreteCreator2();
  ClientCode(*creator2);
  
  // Importante: liberar memoria en C++ tradicional
  delete creator;
  delete creator2;
  
  return 0;
}`,
      explanation: [
        { line: 1, text: "Comentario que describe la interfaz de producto." },
        { line: 4, text: "Declaración de la clase Product como una clase abstracta con un método virtual puro." },
        { line: 5, text: "Los métodos virtuales en C++ permiten la sobreescritura en subclases." },
        { line: 6, text: "Destructor virtual para permitir la liberación correcta de memoria al eliminar a través de un puntero a la clase base." },
        { line: 7, text: "Método de operación puro virtual (=0) que debe ser implementado por todas las subclases." },
        { line: 11, text: "Comentario que describe los productos concretos." },
        { line: 14, text: "Primera implementación concreta de Product." },
        { line: 16, text: "Implementación del método Operation con la palabra clave override que indica que está sobreescribiendo un método virtual." },
        { line: 22, text: "Segunda implementación concreta de Product con diferente comportamiento." },
        { line: 30, text: "Comentario que describe la clase Creator." },
        { line: 34, text: "Destructor virtual para el Creator." },
        { line: 35, text: "Método fábrica virtual puro que deben implementar las subclases." },
        { line: 37, text: "Comentario que explica la responsabilidad principal del Creator." },
        { line: 43, text: "Método que utiliza el producto creado por el método fábrica." },
        { line: 45, text: "Llama al método fábrica para obtener un producto, usando la palabra clave this para acceder al método." },
        { line: 48, text: "Usa el producto para la lógica de negocio." },
        { line: 50, text: "En C++ tradicional, es responsabilidad del programador liberar la memoria asignada con delete." },
        { line: 57, text: "Comentario que describe los creadores concretos." },
        { line: 61, text: "Implementación concreta del método fábrica en la primera subclase." },
        { line: 62, text: "Crea y devuelve un nuevo objeto ConcreteProduct1 usando el operador new para asignar memoria en el heap." },
        { line: 68, text: "Implementación concreta del método fábrica en la segunda subclase, que devuelve un tipo de producto diferente." },
        { line: 74, text: "Comentario que describe el código cliente." },
        { line: 79, text: "El cliente trabaja con el Creator a través de su interfaz, sin conocer la implementación concreta." },
        { line: 83, text: "Función principal que demuestra el patrón usando diferentes creadores." },
        { line: 85, text: "Crea una instancia de ConcreteCreator1." },
        { line: 90, text: "Crea una instancia de ConcreteCreator2." },
        { line: 94, text: "Libera la memoria de los creadores, importante en C++ tradicional para evitar fugas de memoria." }
      ]
    },
    cppModern: {
      code: `/**
 * La interfaz Product declara las operaciones que todos los productos concretos deben implementar.
 */
class Product {
public:
  virtual ~Product() = default; // Destructor por defecto
  virtual std::string Operation() const = 0;
};

/**
 * Los Productos Concretos proporcionan varias implementaciones de la interfaz Product.
 */
class ConcreteProduct1 : public Product {
public:
  std::string Operation() const override {
    return "{Resultado del ConcreteProduct1}";
  }
};

class ConcreteProduct2 : public Product {
public:
  std::string Operation() const override {
    return "{Resultado del ConcreteProduct2}";
  }
};

/**
 * La clase Creator declara el método fábrica que devuelve un objeto de la clase Product.
 * Las subclases de Creator normalmente proporcionan la implementación de este método.
 */
class Creator {
public:
  virtual ~Creator() = default; // Destructor por defecto
  virtual std::unique_ptr<Product> FactoryMethod() const = 0;
  
  /**
   * La responsabilidad principal del Creator no es crear productos, sino contener la
   * lógica de negocio que depende de los objetos Product.
   */
  std::string SomeOperation() const {
    // Llama al método fábrica para crear un objeto Product.
    auto product = this->FactoryMethod();
    
    // Usa el producto.
    std::string result = "Creator: El mismo código del creador ha trabajado con " + product->Operation();
    
    // No necesita delete, el unique_ptr se encarga automáticamente
    return result;
  }
};

/**
 * Los Creadores Concretos sobrescriben el método fábrica para cambiar el tipo de producto resultante.
 */
class ConcreteCreator1 : public Creator {
public:
  std::unique_ptr<Product> FactoryMethod() const override {
    return std::make_unique<ConcreteProduct1>();
  }
};

class ConcreteCreator2 : public Creator {
public:
  std::unique_ptr<Product> FactoryMethod() const override {
    return std::make_unique<ConcreteProduct2>();
  }
};

/**
 * El código cliente trabaja con una instancia de un creador concreto, aunque a través
 * de su interfaz base.
 */
void ClientCode(const Creator& creator) {
  std::cout << "Client: No conozco la clase del creador, pero aún funciona.\\n"
            << creator.SomeOperation() << std::endl;
}

int main() {
  std::cout << "App: Iniciada con ConcreteCreator1.\\n";
  auto creator = std::make_unique<ConcreteCreator1>();
  ClientCode(*creator);
  
  std::cout << "\\nApp: Iniciada con ConcreteCreator2.\\n";
  auto creator2 = std::make_unique<ConcreteCreator2>();
  ClientCode(*creator2);
  
  // No se necesita delete, los smart pointers se encargan de la liberación automática
  
  return 0;
}`,
      explanation: [
        { line: 1, text: "Comentario que describe la interfaz de producto." },
        { line: 4, text: "Declaración de la clase Product como una clase abstracta con un método virtual puro." },
        { line: 6, text: "Uso de '= default' para que el compilador genere un destructor predeterminado, característica de C++11 en adelante." },
        { line: 7, text: "Método de operación puro virtual que debe ser implementado por todas las subclases." },
        { line: 11, text: "Comentario que describe los productos concretos." },
        { line: 14, text: "Primera implementación concreta de Product." },
        { line: 16, text: "Implementación del método Operation con la palabra clave override, que es más explícita en C++11 y posteriores." },
        { line: 22, text: "Segunda implementación concreta de Product con diferente comportamiento." },
        { line: 30, text: "Comentario que describe la clase Creator." },
        { line: 34, text: "Uso de '= default' para el destructor, siguiendo las mejores prácticas de C++ moderno." },
        { line: 35, text: "El método fábrica ahora devuelve un std::unique_ptr, un smart pointer que gestiona automáticamente la memoria." },
        { line: 37, text: "Comentario que explica la responsabilidad principal del Creator." },
        { line: 43, text: "Método que utiliza el producto creado por el método fábrica." },
        { line: 45, text: "Uso de 'auto' para la inferencia de tipos, característica de C++11." },
        { line: 48, text: "Usa el producto para la lógica de negocio." },
        { line: 50, text: "Comentario que explica que ya no es necesario liberar explícitamente la memoria." },
        { line: 57, text: "Comentario que describe los creadores concretos." },
        { line: 61, text: "Implementación concreta del método fábrica usando unique_ptr." },
        { line: 62, text: "Usa std::make_unique para crear el producto (disponible desde C++14), evitando usar 'new' directamente." },
        { line: 68, text: "Implementación concreta del método fábrica en la segunda subclase, también usando smart pointers." },
        { line: 74, text: "Comentario que describe el código cliente." },
        { line: 79, text: "El cliente trabaja con el Creator a través de su interfaz, sin conocer la implementación concreta." },
        { line: 83, text: "Función principal que demuestra el patrón usando diferentes creadores." },
        { line: 85, text: "Usa std::make_unique para crear el creador, evitando memory leaks." },
        { line: 90, text: "Crea una instancia del segundo creador también con make_unique." },
        { line: 93, text: "Comentario que destaca que ya no es necesario liberar memoria manualmente." }
      ]
    },
    java: {
      code: `/**
 * La interfaz Product declara las operaciones que todos los productos concretos deben implementar.
 */
interface Product {
    String operation();
}

/**
 * Los Productos Concretos proporcionan varias implementaciones de la interfaz Product.
 */
class ConcreteProduct1 implements Product {
    @Override
    public String operation() {
        return "{Resultado del ConcreteProduct1}";
    }
}

class ConcreteProduct2 implements Product {
    @Override
    public String operation() {
        return "{Resultado del ConcreteProduct2}";
    }
}

/**
 * La clase Creator declara el método fábrica que devuelve un objeto de la clase Product.
 * Las subclases de Creator normalmente proporcionan la implementación de este método.
 */
abstract class Creator {
    /**
     * El método fábrica debe ser implementado por las subclases.
     */
    public abstract Product factoryMethod();
    
    /**
     * La responsabilidad principal del Creator no es crear productos, sino contener la
     * lógica de negocio que depende de los objetos Product.
     */
    public String someOperation() {
        // Llama al método fábrica para crear un objeto Product.
        Product product = factoryMethod();
        
        // Usa el producto.
        return "Creator: El mismo código del creador ha trabajado con " + product.operation();
    }
}

/**
 * Los Creadores Concretos sobrescriben el método fábrica para cambiar el tipo de producto resultante.
 */
class ConcreteCreator1 extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProduct1();
    }
}

class ConcreteCreator2 extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProduct2();
    }
}

/**
 * El código cliente trabaja con una instancia de un creador concreto, aunque a través
 * de su interfaz base.
 */
class Demo {
    /**
     * El código cliente recibe un creador como parámetro.
     */
    public static void clientCode(Creator creator) {
        System.out.println("Client: No conozco la clase del creador, pero aún funciona.\\n"
                + creator.someOperation());
    }
    
    /**
     * El punto de entrada al programa.
     */
    public static void main(String[] args) {
        System.out.println("App: Iniciada con ConcreteCreator1.");
        Creator creator1 = new ConcreteCreator1();
        clientCode(creator1);
        
        System.out.println("\\nApp: Iniciada con ConcreteCreator2.");
        Creator creator2 = new ConcreteCreator2();
        clientCode(creator2);
    }
}`,
      explanation: [
        { line: 1, text: "Comentario que describe la interfaz de producto." },
        { line: 4, text: "En Java, se utiliza la palabra clave 'interface' para declarar una interfaz en lugar de una clase abstracta." },
        { line: 5, text: "Declaración del método operation sin cuerpo, que deberá ser implementado por las clases que implementen esta interfaz." },
        { line: 9, text: "Comentario que describe los productos concretos." },
        { line: 12, text: "En Java se usa la anotación @Override para indicar que un método está sobrescribiendo un método de una interfaz o superclase." },
        { line: 13, text: "Implementación del método operation para el primer producto concreto." },
        { line: 19, text: "Implementación del segundo producto concreto." },
        { line: 26, text: "Comentario que describe la clase Creator." },
        { line: 30, text: "En Java, se usa 'abstract' para declarar métodos y clases abstractas." },
        { line: 31, text: "Declaración del método fábrica abstracto que las subclases deben implementar." },
        { line: 36, text: "Implementación del método someOperation que utiliza el producto creado." },
        { line: 38, text: "No es necesario usar this explícitamente en Java, aunque es posible para mayor claridad." },
        { line: 41, text: "En Java no es necesario preocuparse por la liberación de memoria, ya que el recolector de basura se encarga automáticamente." },
        { line: 47, text: "Comentario que describe los creadores concretos." },
        { line: 51, text: "Implementación concreta del método fábrica en la primera subclase." },
        { line: 57, text: "Implementación concreta del método fábrica en la segunda subclase." },
        { line: 64, text: "En Java, el código cliente suele estar dentro de una clase separada." },
        { line: 69, text: "Método estático que recibe un Creator y trabaja con él sin conocer su implementación concreta." },
        { line: 76, text: "El método main es el punto de entrada al programa en Java." },
        { line: 78, text: "Creación de la primera instancia de Creator." },
        { line: 82, text: "Creación de la segunda instancia de Creator." },
        { line: 84, text: "No es necesario liberar memoria explícitamente en Java." }
      ]
    }
  },
  comparisons: [
    {
      title: "Manejo de memoria",
      cppTraditional: "En C++ tradicional, la gestión de memoria es manual. Se utilizan punteros crudos y operadores `new` y `delete` para asignar y liberar memoria.",
      cppModern: "C++ moderno utiliza smart pointers (unique_ptr, shared_ptr) para la gestión automática de memoria, evitando memory leaks.",
      java: "Java utiliza un recolector de basura que maneja automáticamente la liberación de memoria, eliminando la necesidad de liberación manual."
    },
    {
      title: "Sintaxis de clases",
      cppTraditional: "Usa clases abstractas con métodos virtuales puros (=0) para definir interfaces.",
      cppModern: "Mantiene la misma estructura pero con mejoras como '= default' para destructores y smart pointers para gestión de memoria.",
      java: "Utiliza explícitamente interfaces con la palabra clave 'interface' y se implementan con 'implements' en lugar de herencia."
    },
    {
      title: "Herencia",
      cppTraditional: "Utiliza herencia con 'public' y métodos virtuales para polimorfismo.",
      cppModern: "Añade la palabra clave 'override' explícita para mejor claridad y detección de errores.",
      java: "Utiliza 'extends' para herencia y 'implements' para interfaces, con anotaciones @Override para indicar sobreescritura."
    },
    {
      title: "Punteros y referencias",
      cppTraditional: "Depende fuertemente de punteros crudos (*) para el polimorfismo y la gestión de memoria dinámica.",
      cppModern: "Utiliza smart pointers y referencias para reducir errores comunes con punteros.",
      java: "No tiene punteros explícitos, todas las clases se pasan por referencia automáticamente."
    }
  ],
  notes: 'El patrón Factory Method es especialmente útil cuando no conoces de antemano las dependencias exactas de tu código. Esto permite que una clase delegue la creación de objetos a sus subclases, promoviendo el bajo acoplamiento. Es uno de los patrones más utilizados en frameworks y librearías. Este patrón se diferencia del Abstract Factory en que Factory Method se enfoca en crear productos individuales, mientras que Abstract Factory se especializa en crear familias de productos relacionados.'
};

export default factoryMethodPattern;
