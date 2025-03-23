/**
 * Patrón Builder en JavaScript
 * Este archivo contiene la implementación del patrón Builder para ser importado
 * en la aplicación principal.
 */

const builderPattern = {
  id: 'builder',
  name: "Builder",
  category: "creational",
  description: "Permite construir objetos complejos paso a paso, separando la construcción de un objeto de su representación final.",
  
  theory: {
    background: 'El patrón Builder se utiliza cuando la creación de un objeto complejo debe ser independiente de las partes que lo componen.',
    problem: 'Cómo crear un objeto complejo con muchas configuraciones posibles sin tener constructores con múltiples parámetros o una gran cantidad de subclases.',
    solution: 'Separar la construcción de un objeto complejo de su representación, permitiendo crear distintas representaciones con el mismo proceso de construcción.',
    applicability: [
      "Cuando el algoritmo para crear un objeto complejo debe ser independiente de las partes que componen el objeto",
      "Cuando el proceso de construcción debe permitir diferentes representaciones para el objeto construido",
      "Cuando se quiere reducir la complejidad de constructores con muchos parámetros"
    ],
    consequences: [
      "Permite variar la representación interna de un objeto",
      "Aísla el código de construcción de la representación final",
      "Proporciona control fino sobre el proceso de construcción",
      "Puede resultar en un código más complejo si los objetos son simples"
    ]
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
