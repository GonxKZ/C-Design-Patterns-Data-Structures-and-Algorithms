// Implementación del patrón Strategy con explicaciones detalladas
// Este patrón define una familia de algoritmos, encapsula cada uno y los hace intercambiables

export const strategyPattern = {
  id: 'strategy',
  category: 'behavioral',
  name: 'Strategy',
  description: 'Define una familia de algoritmos, encapsula cada uno y los hace intercambiables. Strategy permite que el algoritmo varíe independientemente de los clientes que lo utilizan, favoreciendo la composición sobre la herencia y facilitando la selección del comportamiento en tiempo de ejecución sin recurrir a condicionales complejos.',
  
  theory: {
    background: 'El patrón Strategy fue formalizado por la Banda de los Cuatro (GoF) en su libro "Design Patterns". Este patrón tiene sus raíces en los principios fundamentales de la programación orientada a objetos, específicamente en el principio "favorecer la composición sobre la herencia" y "encapsular lo que varía". La idea es extraer comportamientos variables en jerarquías de clases separadas, permitiendo que sean intercambiados dinámicamente sin alterar el código cliente que los utiliza.',
    
    problem: 'En muchos sistemas, un mismo problema puede resolverse de diferentes maneras según el contexto. Implementar estas variantes directamente en el código cliente usando condicionales crea dependencias rígidas, dificulta la mantención y viola el principio Open/Closed. A medida que aumentan las variantes o se añaden nuevas condiciones, el código se vuelve cada vez más complejo y propenso a errores. Además, mezclar múltiples algoritmos con la lógica de negocio dificulta la reutilización, el testing y la extensión del sistema cuando aparecen nuevos requisitos.',
    
    solution: 'El patrón Strategy define una familia de algoritmos, encapsula cada uno en una clase separada que implementa una interfaz común, y los hace intercambiables. Permite seleccionar el algoritmo en tiempo de ejecución. La clase contexto mantiene una referencia a una estrategia y delega en ella la ejecución del algoritmo. Esta separación permite modificar, añadir o eliminar algoritmos sin afectar al contexto o a los clientes. El contexto puede cambiar dinámicamente la estrategia utilizada, ya sea por requerimiento del cliente o en respuesta a condiciones de ejecución. El poder del patrón Strategy radica en su capacidad para encapsular algoritmos completos, incluyendo sus dependencias y estado interno, detrás de una interfaz simple y uniforme, lo que facilita enormemente su intercambio y prueba.',
    
    applicability: [
      'Cuando necesitas usar diferentes variantes de un algoritmo dentro de un objeto y poder cambiarlas durante el tiempo de ejecución',
      'Cuando tienes muchas clases relacionadas que solo difieren en su comportamiento',
      'Para aislar la lógica de negocio de una clase de los detalles de implementación de algoritmos que pueden no ser tan importantes en su contexto',
      'Cuando una clase define muchos comportamientos, y estos aparecen como múltiples declaraciones condicionales en sus operaciones',
      'Para eliminar condicionales grandes que seleccionan el comportamiento a ejecutar, reemplazándolos con objetos estrategia',
      'Cuando quieres ocultar la complejidad de múltiples algoritmos del código cliente',
      'Cuando tienes un conjunto de algoritmos donde solo uno será utilizado en un momento dado según las condiciones de ejecución o entradas del cliente',
      'Cuando deseas implementar el principio de responsabilidad única separando la política de selección de algoritmos de su implementación',
      'Para facilitar la adición de nuevos comportamientos sin modificar las clases existentes (Principio Open/Closed)',
      'Cuando diferentes partes de la aplicación tienen requisitos variables para el mismo tipo de operación',
      'Para aislar el conocimiento específico del algoritmo del código que lo utiliza, facilitando cambios y mantenimiento'
    ],
    
    consequences: [
      'Permite la sustitución de algoritmos en tiempo de ejecución',
      'Aísla la implementación de un algoritmo del código que lo utiliza',
      'Elimina condicionales complejos al encapsular algoritmos en clases separadas',
      'Promueve la reutilización de código a través de la herencia o composición de estrategias',
      'Facilita el testing aislado de cada estrategia y del contexto',
      'Facilita la extensión del sistema con nuevas estrategias sin modificar el código existente',
      'Mejora la cohesión al separar comportamientos específicos de la lógica general',
      'Puede aumentar el número de objetos en el sistema, creando sobrecarga si hay muchas estrategias',
      'Incrementa la complejidad inicial debido a la creación de múltiples clases e interfaces',
      'El cliente debe conocer las diferentes estrategias para elegir la apropiada',
      'Puede complicar el diseño si las estrategias requieren comunicación bidireccional con el contexto',
      'Posible sobrecarga de rendimiento en caso de estrategias que requieren estado compartido entre llamadas',
      'Dificultad para mantener la consistencia entre estrategias relacionadas si cambian los requisitos de la interfaz común'
    ],
    
    notes: 'El patrón Strategy es muy útil cuando necesitas diferentes variantes de un algoritmo y quieres poder cambiar entre ellas dinámicamente. Es especialmente valioso para evitar condicionales extensos, permitir configuración en tiempo de ejecución, y proporcionar flexibilidad en sistemas extensibles. Existen variantes como Strategy con objetos de función, Strategy estático, y Strategy con composición. Se puede aplicar en escenarios como navegación GPS, métodos de pago, exportación de datos, y algoritmos de pricing dinámico. Para una implementación efectiva, define interfaces claras, proporciona estrategias por defecto, y considera usar el patrón nulo. Strategy se diferencia de otros patrones como State, Command y Template Method en su enfoque en encapsular algoritmos intercambiables, mientras que los otros se centran en estados, solicitudes o estructuras de algoritmos fijos respectivamente.'
  },
  
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
  notes: 'El patrón Strategy es particularmente útil en lenguajes orientados a objetos que soportan interfaces y polimorfismo. Sin embargo, en lenguajes con funciones de primera clase como JavaScript, Python o lenguajes funcionales, a menudo se puede implementar de forma más sencilla utilizando funciones en lugar de clases. Las implementaciones modernas en lenguajes con tipado estático pueden aprovechar genéricos/templates para crear estrategias más flexibles y type-safe. El patrón Strategy a menudo se combina con otros patrones como Factory Method para crear estrategias adecuadas, Singleton para estrategias sin estado que pueden ser compartidas, o Flyweight para optimizar el uso de memoria cuando se utilizan muchas instancias. Al implementar este patrón, es importante considerar el equilibrio entre flexibilidad y complejidad, y evaluar si la variabilidad del comportamiento justifica la introducción de este patrón.'
};

// Exportamos el patrón
export default strategyPattern;
