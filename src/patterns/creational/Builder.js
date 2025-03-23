/**
 * Patrón Builder en JavaScript
 * Este archivo contiene la implementación del patrón Builder para ser importado
 * en la aplicación principal.
 */

const builderPattern = {
  id: 'builder',
  name: 'Builder',
  category: 'creational',
  description: 'Separa la construcción de un objeto complejo de su representación, permitiendo que el mismo proceso de construcción pueda crear diferentes representaciones. Resuelve el problema de la construcción paso a paso de objetos complejos sin contaminar las clases principales con lógica de construcción.',
  
  theory: {
    background: 'El patrón Builder fue formalizado por la Banda de los Cuatro (GoF) como una solución a las limitaciones de los constructores tradicionales. Se originó en respuesta a la necesidad de crear objetos con muchos parámetros opcionales o configuraciones complejas sin caer en constructores telescópicos o sobrecargados. El concepto se inspira en procesos de fabricación industrial, donde diferentes líneas de ensamblaje pueden producir variaciones del mismo producto base.',
    
    problem: 'Al crear objetos complejos, un constructor con muchos parámetros puede volverse difícil de usar y mantener. Esto se agrava cuando algunos parámetros son opcionales o cuando el proceso de construcción implica múltiples pasos con variaciones. Además, a veces queremos construir diferentes representaciones del mismo objeto, lo que complica aún más el uso de constructores tradicionales.',
    
    solution: 'El patrón Builder proporciona una solución al separar la construcción del objeto de su representación final. Introduce un objeto constructor (Builder) para crear partes de un objeto complejo paso a paso y un Director que coordina el proceso. El patrón permite construir diferentes representaciones usando el mismo proceso de construcción.',
    
    applicability: [
      'Cuando el algoritmo para crear un objeto complejo debe ser independiente de las partes que componen el objeto y cómo se ensamblan',
      'Cuando el proceso de construcción debe permitir diferentes representaciones o configuraciones del objeto que se está construyendo',
      'Para manejar constructores con demasiados parámetros o con muchos parámetros opcionales',
      'Cuando la construcción del objeto requiere pasos específicos que deben ejecutarse en un orden determinado',
      'Para encapsular la lógica de construcción compleja en un lugar separado de la lógica de negocio'
    ],
    
    consequences: [
      'Permite variar la representación interna de un producto sin afectar al código cliente',
      'Aísla el código de construcción complejo de la lógica de negocio del producto',
      'Proporciona mayor control sobre el proceso de construcción, permitiendo una construcción paso a paso',
      'Mejora la legibilidad y mantenibilidad al eliminar constructores telescópicos',
      'Facilita la adición de nuevos tipos de productos sin cambiar el código existente',
      'Puede introducir complejidad adicional en el código si la estructura del objeto no justifica un builder separado'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Builder?</h3>
      <ul>
        <li><strong>Objetos con muchos parámetros:</strong> Cuando el constructor tiene muchos parámetros, especialmente si varios son opcionales.</li>
        <li><strong>Construcción paso a paso:</strong> Cuando el objeto debe construirse en etapas claramente definidas.</li>
        <li><strong>Diferentes representaciones:</strong> Cuando necesitas construir diferentes tipos o versiones del mismo objeto.</li>
        <li><strong>Inmutabilidad:</strong> Cuando estás construyendo objetos inmutables, pero el proceso de construcción requiere varios pasos.</li>
        <li><strong>Validación compleja:</strong> Cuando necesitas validar cada parte del objeto antes de finalizar su construcción.</li>
      </ul>
      
      <h3>Variantes del patrón Builder:</h3>
      <ul>
        <li><strong>Builder fluido (method chaining):</strong> Implementación donde cada método del builder devuelve 'this', permitiendo encadenar llamadas como: <code>builder.setX().setY().build()</code>.</li>
        <li><strong>Builder con Director:</strong> Incorpora una clase Director que define el orden de las operaciones, útil cuando hay algoritmos de construcción complejos que podrían reutilizarse.</li>
        <li><strong>Builder anidado:</strong> Donde el Builder se define como una clase estática interna del producto, mejorando el encapsulamiento.</li>
        <li><strong>Builder recursivo:</strong> Donde el builder devuelve un tipo diferente según el paso de construcción, asegurando que los métodos se llamen en cierto orden.</li>
        <li><strong>Builder funcional:</strong> Utiliza funciones de orden superior o lambdas para especificar cómo se construye cada parte.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Constructores de consultas SQL:</strong> Como Hibernate Criteria, JOOQ o QueryDSL, que permiten construir consultas complejas paso a paso.</li>
        <li><strong>Frameworks de UI:</strong> Para construir interfaces de usuario complejas, como SwiftUI, Flutter o JavaFX Scene Builder.</li>
        <li><strong>Parsers y generadores de documentos:</strong> Para PDF, HTML o XML, como Apache PDFBox o javax.xml builders.</li>
        <li><strong>Configuración de objetos:</strong> En frameworks como Spring (BeanDefinitionBuilder) o tests (TestContainers).</li>
        <li><strong>HTTP Clients:</strong> Como OkHttp, donde RequestBuilder permite configurar solicitudes HTTP complejas.</li>
        <li><strong>Constructores de objetos inmutables:</strong> En Java, clases como StringBuilder, Calendar.Builder, o Stream.Builder.</li>
      </ul>
      
      <h3>Builder vs Factory Method vs Abstract Factory</h3>
      <ul>
        <li><strong>Builder:</strong> Se centra en la construcción paso a paso de objetos complejos, con énfasis en el proceso y los componentes individuales.</li>
        <li><strong>Factory Method:</strong> Se enfoca en crear un objeto en un solo paso a través de una interfaz, delegando la creación a subclases.</li>
        <li><strong>Abstract Factory:</strong> Proporciona una interfaz para crear familias de objetos relacionados sin especificar sus clases concretas.</li>
      </ul>
    `
  },
  
  implementations: {
    cppTraditional: {
      code: `/**
 * El patrón Builder tiene sentido cuando tus productos son complejos
 * y requieren una extensa configuración.
 */
class Product {
public:
  std::vector<std::string> parts_;
  
  void ListParts() const {
    std::cout << "Partes del producto: ";
    for (size_t i = 0; i < parts_.size(); i++) {
      if (parts_[i] == parts_.back()) {
        std::cout << parts_[i];
      } else {
        std::cout << parts_[i] << ", ";
      }
    }
    std::cout << "\\n";
  }
};

/**
 * La interfaz Builder especifica métodos para crear las diferentes partes
 * de los objetos Product.
 */
class Builder {
public:
  virtual ~Builder() {}
  virtual void ProducePartA() const = 0;
  virtual void ProducePartB() const = 0;
  virtual void ProducePartC() const = 0;
};

/**
 * Las clases ConcreteBuilder siguen la interfaz Builder y proporcionan
 * implementaciones específicas de los pasos de construcción.
 */
class ConcreteBuilder1 : public Builder {
private:
  Product* product;

public:
  ConcreteBuilder1() {
    this->Reset();
  }
  
  ~ConcreteBuilder1() {
    delete product;
  }
  
  void Reset() {
    this->product = new Product();
  }
  
  /**
   * Todos los pasos de producción trabajan con la misma instancia del producto.
   */
  void ProducePartA() const override {
    this->product->parts_.push_back("PartA1");
  }
  
  void ProducePartB() const override {
    this->product->parts_.push_back("PartB1");
  }
  
  void ProducePartC() const override {
    this->product->parts_.push_back("PartC1");
  }
  
  /**
   * Los Builders concretos deben proporcionar sus propios métodos para
   * recuperar resultados. Diferentes builders pueden crear productos
   * completamente diferentes.
   *
   * Ten cuidado con la gestión de memoria. Una vez que llames a
   * GetProduct, el usuario de esta función es responsable de liberar esta
   * memoria.
   */
  Product* GetProduct() {
    Product* result = this->product;
    this->Reset();
    return result;
  }
};

/**
 * El Director es responsable de ejecutar los pasos de construcción en una
 * secuencia particular.
 */
class Director {
private:
  Builder* builder;

public:
  void SetBuilder(Builder* builder) {
    this->builder = builder;
  }
  
  /**
   * El Director puede construir varias variaciones de productos usando
   * los mismos pasos de construcción.
   */
  void BuildMinimalViableProduct() {
    this->builder->ProducePartA();
  }
  
  void BuildFullFeaturedProduct() {
    this->builder->ProducePartA();
    this->builder->ProducePartB();
    this->builder->ProducePartC();
  }
};

/**
 * El código cliente crea un objeto builder, lo pasa al director y luego
 * inicia el proceso de construcción. El resultado final se recupera del
 * objeto builder.
 */
void ClientCode(Director& director) {
  // Usando punteros crudos para simplicidad
  ConcreteBuilder1* builder = new ConcreteBuilder1();
  director.SetBuilder(builder);
  
  std::cout << "Producto básico estándar:" << std::endl;
  director.BuildMinimalViableProduct();
  Product* p = builder->GetProduct();
  p->ListParts();
  delete p;
  
  std::cout << "Producto completo con todas las características:" << std::endl;
  director.BuildFullFeaturedProduct();
  p = builder->GetProduct();
  p->ListParts();
  delete p;
  
  // Recuerda, el patrón Builder puede usarse sin una clase Director
  std::cout << "Producto personalizado:" << std::endl;
  builder->ProducePartA();
  builder->ProducePartC();
  p = builder->GetProduct();
  p->ListParts();
  delete p;
  
  delete builder;
}

int main() {
  Director* director = new Director();
  ClientCode(*director);
  delete director;
  return 0;
}`,
      explanation: [
        { line: 1, text: "Comentario que explica cuándo tiene sentido usar el patrón Builder." },
        { line: 4, text: "Definición de la clase Product que representa el objeto complejo que estamos construyendo." },
        { line: 5, text: "El producto contiene un vector de partes como ejemplo de estructura compleja." },
        { line: 7, text: "Método para listar las partes del producto para visualización." },
        { line: 19, text: "Definición de la interfaz Builder abstracta con métodos virtuales puros." },
        { line: 22, text: "Destructor virtual para permitir la correcta liberación de memoria en clases derivadas." },
        { line: 23, text: "Métodos virtuales puros que deberán ser implementados por los builders concretos." },
        { line: 29, text: "Implementación concreta de Builder que construye un tipo específico de producto." },
        { line: 31, text: "El builder mantiene una referencia al producto que está construyendo." },
        { line: 34, text: "Constructor que inicializa el builder llamando a Reset." },
        { line: 38, text: "Destructor que libera la memoria del producto." },
        { line: 42, text: "Método Reset que crea una nueva instancia del producto." },
        { line: 46, text: "Comentario que explica que todos los pasos trabajarán con la misma instancia del producto." },
        { line: 48, text: "Implementación de ProducePartA que añade la parte A al producto." },
        { line: 52, text: "Implementación de ProducePartB que añade la parte B al producto." },
        { line: 56, text: "Implementación de ProducePartC que añade la parte C al producto." },
        { line: 60, text: "Comentario que explica la recuperación de resultados y la gestión de memoria." },
        { line: 68, text: "Método GetProduct que devuelve el producto actual y reinicia el builder." },
        { line: 74, text: "Definición de la clase Director que coordina el proceso de construcción." },
        { line: 76, text: "El director mantiene una referencia al builder que utilizará." },
        { line: 79, text: "Método para establecer el builder que utilizará el director." },
        { line: 84, text: "Comentario que explica que el director puede construir diferentes variantes del producto." },
        { line: 86, text: "Método para construir un producto mínimo viable usando el builder." },
        { line: 90, text: "Método para construir un producto completo con todas las características." },
        { line: 97, text: "Comentario que describe el código cliente que utiliza el director y el builder." },
        { line: 100, text: "El código cliente crea un builder concreto." },
        { line: 101, text: "Pasa el builder al director." },
        { line: 104, text: "Construye un producto mínimo y lo muestra." },
        { line: 109, text: "Construye un producto completo y lo muestra." },
        { line: 115, text: "Demuestra el uso del builder sin director para crear un producto personalizado." },
        { line: 123, text: "Función principal que crea un director y ejecuta el código cliente." }
      ]
    },
    cppModern: {
      code: `/**
 * El patrón Builder tiene sentido cuando tus productos son complejos
 * y requieren una extensa configuración.
 */
class Product {
public:
  std::vector<std::string> parts_;
  
  void ListParts() const {
    std::cout << "Partes del producto: ";
    for (const auto& part : parts_) { // Uso de range-based for loop (C++11)
      if (&part == &parts_.back()) {
        std::cout << part;
      } else {
        std::cout << part << ", ";
      }
    }
    std::cout << "\\n";
  }
};

/**
 * La interfaz Builder especifica métodos para crear las diferentes partes
 * de los objetos Product.
 */
class Builder {
public:
  virtual ~Builder() = default; // Uso de default (C++11)
  virtual void ProducePartA() const = 0;
  virtual void ProducePartB() const = 0;
  virtual void ProducePartC() const = 0;
};

/**
 * Las clases ConcreteBuilder siguen la interfaz Builder y proporcionan
 * implementaciones específicas de los pasos de construcción.
 */
class ConcreteBuilder1 : public Builder {
private:
  std::unique_ptr<Product> product; // Uso de smart pointer (C++11)

public:
  ConcreteBuilder1() {
    this->Reset();
  }
  
  // No necesitamos destructor explícito debido al uso de unique_ptr
  
  void Reset() {
    product = std::make_unique<Product>(); // Uso de make_unique (C++14)
  }
  
  /**
   * Todos los pasos de producción trabajan con la misma instancia del producto.
   */
  void ProducePartA() const override {
    product->parts_.push_back("PartA1");
  }
  
  void ProducePartB() const override {
    product->parts_.push_back("PartB1");
  }
  
  void ProducePartC() const override {
    product->parts_.push_back("PartC1");
  }
  
  /**
   * Los Builders concretos deben proporcionar sus propios métodos para
   * recuperar resultados. Diferentes builders pueden crear productos
   * completamente diferentes.
   */
  std::unique_ptr<Product> GetProduct() {
    auto result = std::move(product); // Transferencia de propiedad usando move (C++11)
    Reset();
    return result; // Se devuelve por movimiento, no por copia
  }
};

/**
 * El Director es responsable de ejecutar los pasos de construcción en una
 * secuencia particular.
 */
class Director {
private:
  Builder* builder; // Todavía usa puntero crudo, pero solo como referencia

public:
  void SetBuilder(Builder* builder) {
    this->builder = builder;
  }
  
  /**
   * El Director puede construir varias variaciones de productos usando
   * los mismos pasos de construcción.
   */
  void BuildMinimalViableProduct() {
    this->builder->ProducePartA();
  }
  
  void BuildFullFeaturedProduct() {
    this->builder->ProducePartA();
    this->builder->ProducePartB();
    this->builder->ProducePartC();
  }
};

/**
 * El código cliente crea un objeto builder, lo pasa al director y luego
 * inicia el proceso de construcción. El resultado final se recupera del
 * objeto builder.
 */
void ClientCode(Director& director) {
  // Usando smart pointers para mejor gestión de memoria
  auto builder = std::make_unique<ConcreteBuilder1>();
  director.SetBuilder(builder.get()); // Pasamos un puntero crudo usando get()
  
  std::cout << "Producto básico estándar:" << std::endl;
  director.BuildMinimalViableProduct();
  auto p = builder->GetProduct();
  p->ListParts();
  
  std::cout << "Producto completo con todas las características:" << std::endl;
  director.BuildFullFeaturedProduct();
  p = builder->GetProduct();
  p->ListParts();
  
  // Recuerda, el patrón Builder puede usarse sin una clase Director
  std::cout << "Producto personalizado:" << std::endl;
  builder->ProducePartA();
  builder->ProducePartC();
  p = builder->GetProduct();
  p->ListParts();
  
  // No necesitamos delete, los smart pointers se encargan automáticamente
}

int main() {
  auto director = std::make_unique<Director>();
  ClientCode(*director);
  return 0;
}`,
      explanation: [
        { line: 1, text: "Comentario que explica cuándo tiene sentido usar el patrón Builder." },
        { line: 4, text: "Definición de la clase Product similar a la versión tradicional." },
        { line: 9, text: "Método para listar las partes, pero usando un bucle range-based for introducido en C++11." },
        { line: 10, text: "Uso de auto para deducción de tipos, característica de C++11." },
        { line: 22, text: "Interfaz Builder similar a la versión tradicional." },
        { line: 24, text: "Destructor virtual usando '= default', una característica de C++11 que indica al compilador que genere un destructor predeterminado." },
        { line: 34, text: "La versión moderna usa std::unique_ptr en lugar de punteros crudos para gestión automática de memoria." },
        { line: 41, text: "No se necesita un destructor explícito porque unique_ptr maneja automáticamente la liberación de memoria." },
        { line: 44, text: "El método Reset ahora usa std::make_unique para crear el producto (característica de C++14)." },
        { line: 62, text: "GetProduct ahora devuelve un unique_ptr y usa std::move para transferir la propiedad del recurso." },
        { line: 64, text: "Importante: el objeto se transfiere, no se copia." },
        { line: 74, text: "Director mantiene un puntero a Builder, pero solo como referencia, no gestiona su memoria." },
        { line: 96, text: "El código cliente ahora usa smart pointers." },
        { line: 97, text: "Creamos el builder con std::make_unique." },
        { line: 98, text: "Usamos builder.get() para obtener el puntero crudo subyacente cuando se requiere." },
        { line: 115, text: "Ya no es necesario liberar la memoria manualmente." },
        { line: 119, text: "En la función principal, también usamos smart pointers." }
      ]
    },
    java: {
      code: `/**
 * El patrón Builder tiene sentido cuando tus productos son complejos
 * y requieren una extensa configuración.
 */
class Product {
    private final List<String> parts = new ArrayList<>();
    
    public void add(String part) {
        parts.add(part);
    }
    
    public void listParts() {
        System.out.println("Partes del producto: " + String.join(", ", parts));
    }
}

/**
 * La interfaz Builder especifica métodos para crear las diferentes partes
 * de los objetos Product.
 */
interface Builder {
    void producePartA();
    void producePartB();
    void producePartC();
    Product getProduct();
}

/**
 * Las clases ConcreteBuilder siguen la interfaz Builder y proporcionan
 * implementaciones específicas de los pasos de construcción.
 */
class ConcreteBuilder implements Builder {
    private Product product;
    
    public ConcreteBuilder() {
        this.reset();
    }
    
    private void reset() {
        this.product = new Product();
    }
    
    @Override
    public void producePartA() {
        product.add("PartA1");
    }
    
    @Override
    public void producePartB() {
        product.add("PartB1");
    }
    
    @Override
    public void producePartC() {
        product.add("PartC1");
    }
    
    /**
     * Es importante devolver una nueva instancia con cada llamada para
     * el cliente no pueda alterar el producto en proceso.
     */
    @Override
    public Product getProduct() {
        Product result = this.product;
        this.reset();
        return result;
    }
}

/**
 * El Director es responsable de ejecutar los pasos de construcción en una
 * secuencia particular.
 */
class Director {
    private Builder builder;
    
    public void setBuilder(Builder builder) {
        this.builder = builder;
    }
    
    /**
     * El Director puede construir varias variaciones de productos usando
     * los mismos pasos de construcción.
     */
    public void buildMinimalViableProduct() {
        builder.producePartA();
    }
    
    public void buildFullFeaturedProduct() {
        builder.producePartA();
        builder.producePartB();
        builder.producePartC();
    }
}

/**
 * El cliente crea un objeto builder, lo pasa al director y luego
 * inicia el proceso de construcción. El resultado final se recupera del
 * objeto builder.
 */
public class Demo {
    public static void main(String[] args) {
        Director director = new Director();
        ConcreteBuilder builder = new ConcreteBuilder();
        director.setBuilder(builder);
        
        System.out.println("Producto básico estándar:");
        director.buildMinimalViableProduct();
        Product product = builder.getProduct();
        product.listParts();
        
        System.out.println("Producto completo con todas las características:");
        director.buildFullFeaturedProduct();
        product = builder.getProduct();
        product.listParts();
        
        // Recuerda, el patrón Builder puede usarse sin una clase Director
        System.out.println("Producto personalizado:");
        builder.producePartA();
        builder.producePartC();
        product = builder.getProduct();
        product.listParts();
    }
}`,
      explanation: [
        { line: 1, text: "Comentario que explica cuándo tiene sentido usar el patrón Builder." },
        { line: 4, text: "Definición de la clase Product, que usa tipos nativos de Java." },
        { line: 5, text: "En Java, podemos hacer las colecciones finales (inmutables) pero seguir modificando su contenido." },
        { line: 7, text: "Método para añadir partes al producto." },
        { line: 11, text: "Método para listar las partes usando String.join, que es más elegante en Java." },
        { line: 18, text: "En Java se usa la palabra clave interface para declarar explícitamente una interfaz." },
        { line: 19, text: "Los métodos en las interfaces de Java son implícitamente públicos y abstractos." },
        { line: 28, text: "Implementación concreta del Builder que implementa la interfaz." },
        { line: 37, text: "Se utiliza @Override para indicar que se está implementando un método de la interfaz." },
        { line: 56, text: "En Java, devolver objetos por valor implica pasar una referencia, no hay copia implícita." },
        { line: 67, text: "El Director funciona de manera similar a las versiones de C++." },
        { line: 87, text: "En Java, el cliente suele estar en una clase separada con un método main." },
        { line: 90, text: "No hay preocupación por la gestión de memoria, ya que Java tiene recolector de basura." }
      ]
    }
  },
  comparisons: [
    {
      title: "Gestión de memoria",
      cppTraditional: "Requiere gestión manual de memoria con delete para evitar fugas de memoria.",
      cppModern: "Utiliza smart pointers como unique_ptr para gestión automática y segura de memoria.",
      java: "No requiere gestión manual de memoria gracias al recolector de basura."
    },
    {
      title: "Interfaces y abstracciones",
      cppTraditional: "Usa clases abstractas con métodos virtuales puros para definir el comportamiento.",
      cppModern: "Mantiene el mismo enfoque pero con características modernas como default y auto.",
      java: "Utiliza interfaces explícitas y anotaciones @Override para mejor claridad."
    },
    {
      title: "Transferencia de objetos",
      cppTraditional: "Devuelve punteros crudos, transfiriendo la responsabilidad de liberación al cliente.",
      cppModern: "Utiliza std::move para transferencia eficiente de propiedad con unique_ptr.",
      java: "Las referencias a objetos se pasan implícitamente, la gestión de memoria es automática."
    },
    {
      title: "Iteración y colecciones",
      cppTraditional: "Usa bucles for indexados tradicionales para recorrer colecciones.",
      cppModern: "Aprovecha range-based for loops para una sintaxis más limpia y menos propensa a errores.",
      java: "Utiliza métodos de utilidad como String.join para operaciones comunes de colecciones."
    }
  ],
  notes: 'El patrón Builder es una excelente solución cuando necesitas crear objetos complejos con múltiples parámetros opcionales. Evita la "anti-patrón telescoping constructor" donde tienes múltiples constructores con diferentes combinaciones de parámetros. En C++ moderno, este patrón se beneficia enormemente del uso de smart pointers y semánticas de movimiento, mientras que en Java la implementación es más sencilla debido a la gestión automática de memoria. Una variante popular es el "Builder Fluido" con métodos encadenados que devuelven this para permitir una API más legible.'
};

export default builderPattern;
