// Implementación del patrón Strategy con explicaciones detalladas
// Este patrón define una familia de algoritmos, encapsula cada uno y los hace intercambiables

export const strategyPattern = {
  id: 'strategy',
  category: 'behavioral',
  name: 'Strategy',
  description: 'Define una familia de algoritmos, encapsula cada uno y los hace intercambiables. Strategy permite que el algoritmo varíe independientemente de los clientes que lo utilizan.',
  implementations: {
    cppTraditional: {
      code: `// La interfaz Strategy que declara operaciones comunes a todas las versiones soportadas
class Strategy {
public:
    virtual ~Strategy() {}
    virtual std::string doAlgorithm(const std::vector<std::string> &data) const = 0;
};

// Implementaciones concretas del algoritmo
class ConcreteStrategyA : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        // Ordenamos ascendentemente
        std::string result;
        for (const std::string &item : data) {
            result += item + ", ";
        }
        
        std::sort(result.begin(), result.end());
        return result;
    }
};

class ConcreteStrategyB : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        // Ordenamos descendentemente
        std::string result;
        for (const std::string &item : data) {
            result += item + ", ";
        }
        
        std::sort(result.begin(), result.end(), std::greater<>());
        return result;
    }
};

// El Contexto define la interfaz de interés para los clientes
class Context {
private:
    Strategy* strategy_; // Puntero a la estrategia actual

public:
    // Constructor que acepta una estrategia inicial
    Context(Strategy* strategy = nullptr) : strategy_(strategy) {}
    
    // Destructor que libera la estrategia
    ~Context() {
        delete strategy_;
    }
    
    // Método para cambiar la estrategia en tiempo de ejecución
    void setStrategy(Strategy* strategy) {
        delete strategy_; // Liberamos la estrategia anterior
        strategy_ = strategy;
    }
    
    // El Contexto delega parte del trabajo al objeto Strategy
    std::string doSomeBusinessLogic() const {
        if (strategy_) {
            // El Contexto llama al algoritmo de la estrategia
            std::vector<std::string> data = {"a", "b", "c", "d", "e"};
            return "Contexto: Ordenando datos usando la estrategia (" + strategy_->doAlgorithm(data) + ")";
        } else {
            return "Contexto: No hay estrategia configurada";
        }
    }
};

// Código cliente
int main() {
    // Creamos el contexto con una estrategia concreta
    Context* context = new Context(new ConcreteStrategyA());
    std::cout << "Cliente: Estrategia está configurada para ordenar ascendentemente" << std::endl;
    std::cout << context->doSomeBusinessLogic() << std::endl;
    
    std::cout << std::endl;
    
    // Cambiamos la estrategia
    std::cout << "Cliente: Cambiando estrategia para ordenar descendentemente" << std::endl;
    context->setStrategy(new ConcreteStrategyB());
    std::cout << context->doSomeBusinessLogic() << std::endl;
    
    // Liberamos memoria
    delete context;
    
    return 0;
}`,
      explanation: [
        { line: 2, text: "Definición de la interfaz Strategy que todas las estrategias concretas deben implementar." },
        { line: 4, text: "Destructor virtual para asegurar la limpieza adecuada de las clases derivadas." },
        { line: 5, text: "Método virtual puro que define la operación que realizarán las estrategias." },
        { line: 9, text: "Primera implementación concreta de la estrategia." },
        { line: 11, text: "Implementa doAlgorithm para ordenar de forma ascendente." },
        { line: 12, text: "Crea una cadena con los elementos recibidos." },
        { line: 17, text: "Ordena la cadena de forma ascendente." },
        { line: 22, text: "Segunda implementación concreta de la estrategia." },
        { line: 24, text: "Implementa doAlgorithm para ordenar de forma descendente." },
        { line: 31, text: "Utiliza std::greater para ordenar de forma descendente." },
        { line: 36, text: "Clase Context que utiliza una estrategia para realizar operaciones." },
        { line: 38, text: "Puntero a la estrategia actual." },
        { line: 41, text: "Constructor que acepta una estrategia inicial (opcional)." },
        { line: 44, text: "Destructor que libera la memoria de la estrategia." },
        { line: 49, text: "Método para cambiar la estrategia en tiempo de ejecución." },
        { line: 50, text: "Libera la memoria de la estrategia anterior antes de asignar la nueva." },
        { line: 55, text: "Método que utiliza la estrategia actual para realizar una operación." },
        { line: 56, text: "Verifica que haya una estrategia configurada." },
        { line: 58, text: "Datos de ejemplo para la operación." },
        { line: 59, text: "Llama al método doAlgorithm de la estrategia actual." },
        { line: 67, text: "Código cliente que demuestra el uso del patrón." },
        { line: 69, text: "Crea un contexto con una estrategia inicial (ordenamiento ascendente)." },
        { line: 71, text: "Ejecuta la operación con la estrategia actual." },
        { line: 76, text: "Cambia la estrategia a ordenamiento descendente." },
        { line: 77, text: "Ejecuta la operación con la nueva estrategia." },
        { line: 80, text: "Libera la memoria del contexto (que a su vez libera la estrategia)." }
      ]
    },
    cppModern: {
      code: `// La interfaz Strategy que declara operaciones comunes a todas las versiones soportadas
class Strategy {
public:
    virtual ~Strategy() = default;
    virtual std::string doAlgorithm(const std::vector<std::string> &data) const = 0;
};

// Implementaciones concretas del algoritmo
class ConcreteStrategyA : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        // Ordenamos ascendentemente
        std::string result;
        for (const auto &item : data) {
            result += item + ", ";
        }
        
        std::sort(result.begin(), result.end());
        return result;
    }
};

class ConcreteStrategyB : public Strategy {
public:
    std::string doAlgorithm(const std::vector<std::string> &data) const override {
        // Ordenamos descendentemente
        std::string result;
        for (const auto &item : data) {
            result += item + ", ";
        }
        
        std::sort(result.begin(), result.end(), std::greater<>());
        return result;
    }
};

// El Contexto define la interfaz de interés para los clientes
class Context {
private:
    std::unique_ptr<Strategy> strategy_; // Puntero inteligente a la estrategia actual

public:
    // Constructor que acepta una estrategia inicial
    explicit Context(std::unique_ptr<Strategy> strategy = nullptr) 
        : strategy_(std::move(strategy)) {}
    
    // No necesitamos un destructor explícito gracias a unique_ptr
    
    // Método para cambiar la estrategia en tiempo de ejecución
    void setStrategy(std::unique_ptr<Strategy> strategy) {
        strategy_ = std::move(strategy);
    }
    
    // El Contexto delega parte del trabajo al objeto Strategy
    std::string doSomeBusinessLogic() const {
        if (strategy_) {
            // El Contexto llama al algoritmo de la estrategia
            std::vector<std::string> data = {"a", "b", "c", "d", "e"};
            return "Contexto: Ordenando datos usando la estrategia (" + strategy_->doAlgorithm(data) + ")";
        } else {
            return "Contexto: No hay estrategia configurada";
        }
    }
};

// Código cliente
int main() {
    // Creamos el contexto con una estrategia concreta
    auto context = std::make_unique<Context>(std::make_unique<ConcreteStrategyA>());
    std::cout << "Cliente: Estrategia está configurada para ordenar ascendentemente" << std::endl;
    std::cout << context->doSomeBusinessLogic() << std::endl;
    
    std::cout << std::endl;
    
    // Cambiamos la estrategia
    std::cout << "Cliente: Cambiando estrategia para ordenar descendentemente" << std::endl;
    context->setStrategy(std::make_unique<ConcreteStrategyB>());
    std::cout << context->doSomeBusinessLogic() << std::endl;
    
    // No es necesario liberar memoria explícitamente
    
    return 0;
}`,
      explanation: [
        { line: 2, text: "Definición de la interfaz Strategy que todas las estrategias concretas deben implementar." },
        { line: 4, text: "Destructor virtual usando = default (C++11)." },
        { line: 9, text: "Primera implementación concreta de la estrategia." },
        { line: 13, text: "Uso de 'auto' para inferencia de tipo (C++11)." },
        { line: 22, text: "Segunda implementación concreta de la estrategia." },
        { line: 36, text: "Clase Context que utiliza una estrategia para realizar operaciones." },
        { line: 38, text: "Uso de std::unique_ptr para gestión automática de memoria." },
        { line: 42, text: "Constructor explícito con un parámetro de tipo unique_ptr." },
        { line: 43, text: "Uso de std::move para transferir la propiedad del puntero (C++11)." },
        { line: 45, text: "No necesitamos un destructor explícito gracias a unique_ptr." },
        { line: 48, text: "Método para cambiar la estrategia en tiempo de ejecución." },
        { line: 49, text: "Asignamos el nuevo puntero sin necesidad de liberar el anterior explícitamente." },
        { line: 66, text: "Código cliente que demuestra el uso del patrón." },
        { line: 68, text: "Uso de std::make_unique (C++14) para crear objetos de forma segura." },
        { line: 75, text: "Cambia la estrategia usando make_unique." },
        { line: 78, text: "No necesitamos liberar memoria manualmente." }
      ]
    },
    java: {
      code: `// La interfaz Strategy que declara operaciones comunes a todas las estrategias
interface Strategy {
    String doAlgorithm(List<String> data);
}

// Implementaciones concretas del algoritmo
class ConcreteStrategyA implements Strategy {
    @Override
    public String doAlgorithm(List<String> data) {
        // Ordenamos ascendentemente
        List<String> copy = new ArrayList<>(data);
        Collections.sort(copy);
        
        return copy.toString();
    }
}

class ConcreteStrategyB implements Strategy {
    @Override
    public String doAlgorithm(List<String> data) {
        // Ordenamos descendentemente
        List<String> copy = new ArrayList<>(data);
        Collections.sort(copy, Collections.reverseOrder());
        
        return copy.toString();
    }
}

// El Contexto define la interfaz de interés para los clientes
class Context {
    // Referencia a la estrategia actual
    private Strategy strategy;

    // Constructor que acepta una estrategia inicial
    public Context() {
        this.strategy = null;
    }
    
    // Constructor alternativo
    public Context(Strategy strategy) {
        this.strategy = strategy;
    }
    
    // Método para cambiar la estrategia en tiempo de ejecución
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
    
    // El Contexto delega parte del trabajo al objeto Strategy
    public String doSomeBusinessLogic() {
        if (strategy != null) {
            // El Contexto llama al algoritmo de la estrategia
            List<String> data = Arrays.asList("a", "b", "c", "d", "e");
            return "Contexto: Ordenando datos usando la estrategia (" + strategy.doAlgorithm(data) + ")";
        } else {
            return "Contexto: No hay estrategia configurada";
        }
    }
}

// Demostración del patrón Strategy
public class StrategyDemo {
    public static void main(String[] args) {
        // Creamos el contexto con una estrategia concreta
        Context context = new Context(new ConcreteStrategyA());
        System.out.println("Cliente: Estrategia está configurada para ordenar ascendentemente");
        System.out.println(context.doSomeBusinessLogic());
        
        System.out.println();
        
        // Cambiamos la estrategia
        System.out.println("Cliente: Cambiando estrategia para ordenar descendentemente");
        context.setStrategy(new ConcreteStrategyB());
        System.out.println(context.doSomeBusinessLogic());
    }
}`,
      explanation: [
        { line: 2, text: "Definición de la interfaz Strategy que todas las estrategias concretas deben implementar." },
        { line: 6, text: "Primera implementación concreta de la estrategia." },
        { line: 10, text: "Creamos una copia de la lista para no modificar la original." },
        { line: 11, text: "Ordenamos la copia de forma ascendente usando Collections.sort." },
        { line: 17, text: "Segunda implementación concreta de la estrategia." },
        { line: 21, text: "Ordenamos la copia de forma descendente usando reverseOrder como comparador." },
        { line: 28, text: "Clase Context que utiliza una estrategia para realizar operaciones." },
        { line: 30, text: "Referencia a la estrategia actual (no hay punteros en Java)." },
        { line: 33, text: "Constructor sin parámetros que inicializa sin estrategia." },
        { line: 38, text: "Constructor alternativo que acepta una estrategia inicial." },
        { line: 43, text: "Método para cambiar la estrategia en tiempo de ejecución." },
        { line: 48, text: "Método que utiliza la estrategia actual para realizar una operación." },
        { line: 51, text: "Usamos Arrays.asList para crear los datos de ejemplo." },
        { line: 58, text: "Clase de demostración con el método main." },
        { line: 60, text: "Creamos un contexto con una estrategia inicial (ordenamiento ascendente)." },
        { line: 67, text: "Cambiamos la estrategia a ordenamiento descendente." },
        { line: 68, text: "No es necesario liberar la memoria manualmente." }
      ]
    }
  },
  theory: {
    background: "El patrón Strategy fue introducido por primera vez en el libro 'Design Patterns' del Gang of Four. Este patrón permite seleccionar el algoritmo a utilizar en tiempo de ejecución, facilitando la extensibilidad y mantenimiento del código.",
    problem: "¿Cómo podemos diseñar una clase que tenga comportamientos que varíen según la situación, sin hacer que la clase sea compleja y difícil de mantener? ¿Cómo podemos cambiar el comportamiento de una clase en tiempo de ejecución?",
    solution: "El patrón Strategy define una familia de algoritmos, encapsula cada uno como una clase y los hace intercambiables. Permite que los algoritmos varíen independientemente de los clientes que los utilizan.",
    applicability: [
      "Cuando necesitas utilizar diferentes variantes de un algoritmo dentro de un objeto y poder cambiar de algoritmo en tiempo de ejecución",
      "Cuando hay muchas clases relacionadas que solo difieren en su comportamiento",
      "Cuando quieres aislar la lógica del algoritmo de los detalles de implementación que no deberían conocerlo",
      "Cuando una clase define muchos comportamientos y estos aparecen como múltiples declaraciones condicionales en sus operaciones"
    ],
    consequences: [
      "Permite cambiar algoritmos utilizados dentro de un objeto en tiempo de ejecución",
      "Aísla los detalles de implementación de los algoritmos del código que los utiliza",
      "Facilita la sustitución de herencia por composición",
      "Elimina declaraciones condicionales complejas",
      "Proporciona alternativas a la herencia para compartir comportamientos",
      "En C++ tradicional, requiere gestión manual de memoria que puede ser propensa a errores"
    ]
  },
  comparisons: [
    {
      title: "Gestión de memoria",
      cppTraditional: "Requiere gestión manual con new/delete para crear y destruir estrategias.",
      cppModern: "Usa punteros inteligentes (unique_ptr) para gestionar automáticamente la memoria.",
      java: "No requiere gestión de memoria gracias al recolector de basura (Garbage Collector)."
    },
    {
      title: "Declaración",
      cppTraditional: "Usa herencia para declarar la interfaz Strategy con métodos virtuales puros.",
      cppModern: "Similar a C++ tradicional pero con sintaxis moderna (= default, etc.).",
      java: "Define explícitamente una interfaz usando la palabra clave 'interface'."
    },
    {
      title: "Transferencia de objetos",
      cppTraditional: "Transferencia mediante punteros crudos, lo que puede llevar a problemas de propiedad.",
      cppModern: "Usa std::move para transferir la propiedad de un puntero inteligente, evitando copias innecesarias.",
      java: "No hay concepto de propiedad o movimiento, solo referencias a objetos."
    },
    {
      title: "Manejo de colecciones",
      cppTraditional: "Iteración explícita y tipado explícito.",
      cppModern: "Uso de auto para inferencia de tipo en bucles y otras operaciones.",
      java: "Operaciones más sencillas con colecciones a través de la biblioteca Collections."
    }
  ],
  notes: "El patrón Strategy es especialmente útil cuando se requiere flexibilidad para cambiar algoritmos en tiempo de ejecución. En C++, a menudo se implementa utilizando polimorfismo, mientras que en Java se suele implementar mediante interfaces. Las implementaciones modernas en C++ se benefician enormemente de los punteros inteligentes para una gestión segura de la memoria."
};
