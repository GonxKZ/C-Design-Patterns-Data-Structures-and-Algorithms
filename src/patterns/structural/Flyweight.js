const flyweightPattern = {
  id: 'flyweight',
  name: 'Flyweight',
  category: 'structural',
  description: 'El patrón Flyweight reduce el uso de memoria compartiendo eficientemente objetos que se utilizan en múltiples contextos simultáneamente. El patrón separa las partes intrínsecas (compartidas) y extrínsecas (contextuales) de un objeto para permitir un gran número de objetos aparentemente únicos.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// Clase Flyweight - representa un árbol con datos intrínsecos compartidos
class TreeType {
private:
    std::string name;
    std::string color;
    std::string texture;

public:
    TreeType(const std::string& name, const std::string& color, const std::string& texture)
        : name(name), color(color), texture(texture) {}

    void render(int x, int y, double scale) const {
        std::cout << "Renderizando árbol tipo '" << name << "' con color " << color 
                  << " y textura " << texture << " en posición (" << x << "," << y 
                  << ") con escala " << scale << std::endl;
    }
};

// Fábrica Flyweight - gestiona la creación y reutilización de flyweights
class TreeFactory {
private:
    std::unordered_map<std::string, TreeType*> treeTypes;

public:
    ~TreeFactory() {
        // Liberar memoria
        for (auto& pair : treeTypes) {
            delete pair.second;
        }
    }

    TreeType* getTreeType(const std::string& name, const std::string& color, const std::string& texture) {
        // Crear clave única para este tipo de árbol
        std::string key = name + "_" + color + "_" + texture;
        
        // Buscar si ya existe este tipo
        auto it = treeTypes.find(key);
        if (it != treeTypes.end()) {
            return it->second;
        }
        
        // Si no existe, crear un nuevo tipo y almacenarlo
        TreeType* type = new TreeType(name, color, texture);
        treeTypes[key] = type;
        std::cout << "Creado nuevo tipo de árbol: " << key << std::endl;
        return type;
    }
    
    int getCount() const {
        return treeTypes.size();
    }
};

// Objeto contextual que utiliza el flyweight
class Tree {
private:
    int x;
    int y;
    double scale;
    TreeType* type;  // Referencia al flyweight

public:
    Tree(int x, int y, double scale, TreeType* type)
        : x(x), y(y), scale(scale), type(type) {}

    void render() const {
        type->render(x, y, scale);
    }
};

// Bosque - contiene múltiples árboles
class Forest {
private:
    std::vector<Tree> trees;
    TreeFactory factory;

public:
    void plantTree(int x, int y, double scale, const std::string& name, const std::string& color, const std::string& texture) {
        TreeType* treeType = factory.getTreeType(name, color, texture);
        trees.emplace_back(x, y, scale, treeType);
    }
    
    void render() const {
        for (const auto& tree : trees) {
            tree.render();
        }
        std::cout << "Total de tipos de árboles utilizados: " << factory.getCount() 
                  << " para " << trees.size() << " árboles" << std::endl;
    }
};

int main() {
    Forest forest;
    
    // Plantamos muchos árboles de pocos tipos diferentes
    forest.plantTree(1, 2, 1.0, "Pino", "Verde", "Rugosa");
    forest.plantTree(5, 3, 1.1, "Pino", "Verde", "Rugosa"); // Reutiliza el flyweight
    forest.plantTree(10, 5, 0.9, "Pino", "Verde", "Rugosa"); // Reutiliza el flyweight
    
    forest.plantTree(15, 8, 1.2, "Roble", "Verde oscuro", "Agrietada");
    forest.plantTree(17, 10, 1.3, "Roble", "Verde oscuro", "Agrietada"); // Reutiliza el flyweight
    
    forest.plantTree(20, 15, 1.5, "Abeto", "Verde azulado", "Lisa");
    
    // Renderizamos el bosque
    forest.render();
    
    return 0;
}`,
      explanation: [
        { line: 7, text: 'La clase TreeType es el Flyweight, que contiene el estado intrínseco compartido entre múltiples árboles.' },
        { line: 16, text: 'El método render recibe parámetros extrínsecos (posición y escala) que varían por instancia.' },
        { line: 25, text: 'TreeFactory actúa como una fábrica y caché de objetos Flyweight.' },
        { line: 30, text: 'El destructor libera la memoria de los TreeType creados.' },
        { line: 36, text: 'Este método es clave: busca un TreeType existente o crea uno nuevo si no existe.' },
        { line: 40, text: 'Comprueba si ya existe un TreeType con estos parámetros para reutilizarlo.' },
        { line: 52, text: 'Método para obtener la cantidad de tipos únicos de árboles, útil para verificar la eficiencia.' },
        { line: 59, text: 'La clase Tree contiene el estado extrínseco (posición y escala) y una referencia al flyweight.' },
        { line: 70, text: 'Forest es un contenedor de árboles que utiliza la fábrica para gestionar los flyweights.' },
        { line: 76, text: 'El método plantTree obtiene un flyweight de la fábrica y crea un árbol contextual.' },
        { line: 90, text: 'En el método main, creamos un bosque y plantamos varios árboles.' },
        { line: 94, text: 'Estos árboles comparten el mismo tipo (flyweight), lo que ahorra memoria.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>
#include <vector>

// Clase Flyweight - representa un árbol con datos intrínsecos compartidos
class TreeType {
private:
    std::string name;
    std::string color;
    std::string texture;

public:
    TreeType(std::string name, std::string color, std::string texture)
        : name(std::move(name)), color(std::move(color)), texture(std::move(texture)) {}

    void render(int x, int y, double scale) const {
        std::cout << "Renderizando árbol tipo '" << name << "' con color " << color 
                  << " y textura " << texture << " en posición (" << x << "," << y 
                  << ") con escala " << scale << std::endl;
    }
};

// Fábrica Flyweight con smart pointers
class TreeFactory {
private:
    std::unordered_map<std::string, std::shared_ptr<TreeType>> treeTypes;

public:
    std::shared_ptr<TreeType> getTreeType(std::string name, std::string color, std::string texture) {
        // Crear clave única para este tipo de árbol
        std::string key = name + "_" + color + "_" + texture;
        
        // Buscar si ya existe este tipo o crear uno nuevo con Smart Pointers
        auto& type = treeTypes[key];
        if (!type) {
            type = std::make_shared<TreeType>(std::move(name), std::move(color), std::move(texture));
            std::cout << "Creado nuevo tipo de árbol: " << key << std::endl;
        }
        
        return type;
    }
    
    size_t getCount() const {
        return treeTypes.size();
    }
};

// Objeto contextual que utiliza el flyweight
class Tree {
private:
    int x;
    int y;
    double scale;
    std::shared_ptr<TreeType> type;  // Referencia al flyweight con Smart Pointer

public:
    Tree(int x, int y, double scale, std::shared_ptr<TreeType> type)
        : x(x), y(y), scale(scale), type(std::move(type)) {}

    void render() const {
        type->render(x, y, scale);
    }
};

// Clase para la generación aleatoria de árboles
class TreeGenerator {
public:
    static std::pair<int, int> randomPosition(int maxX, int maxY) {
        return {rand() % maxX, rand() % maxY};
    }
    
    static double randomScale(double min, double max) {
        return min + (static_cast<double>(rand()) / RAND_MAX) * (max - min);
    }
    
    static std::string randomTreeType() {
        const std::vector<std::string> types = {"Pino", "Roble", "Abeto", "Abedul", "Sauce"};
        return types[rand() % types.size()];
    }
    
    static std::string randomColor() {
        const std::vector<std::string> colors = {"Verde", "Verde oscuro", "Verde azulado", "Verde amarillento"};
        return colors[rand() % colors.size()];
    }
    
    static std::string randomTexture() {
        const std::vector<std::string> textures = {"Rugosa", "Agrietada", "Lisa", "Escamosa"};
        return textures[rand() % textures.size()];
    }
};

// Bosque - contenedor de árboles
class Forest {
private:
    std::vector<Tree> trees;
    TreeFactory factory;
    
public:
    void plantTree(int x, int y, double scale, const std::string& name, 
                   const std::string& color, const std::string& texture) {
        auto treeType = factory.getTreeType(name, color, texture);
        trees.emplace_back(x, y, scale, std::move(treeType));
    }
    
    // Método para generar árboles aleatoriamente
    void generateRandomForest(int count, int maxX, int maxY) {
        for (int i = 0; i < count; ++i) {
            auto [x, y] = TreeGenerator::randomPosition(maxX, maxY);
            double scale = TreeGenerator::randomScale(0.8, 1.5);
            std::string type = TreeGenerator::randomTreeType();
            std::string color = TreeGenerator::randomColor();
            std::string texture = TreeGenerator::randomTexture();
            
            plantTree(x, y, scale, type, color, texture);
        }
    }
    
    void render() const {
        for (const auto& tree : trees) {
            tree.render();
        }
        std::cout << "Total de tipos de árboles únicos: " << factory.getCount() 
                  << " para " << trees.size() << " árboles" << std::endl;
        
        // Cálculo de memoria ahorrada
        size_t memoryWithoutFlyweight = trees.size() * (sizeof(Tree) + sizeof(TreeType));
        size_t memoryWithFlyweight = trees.size() * sizeof(Tree) + factory.getCount() * sizeof(TreeType);
        
        std::cout << "Memoria aproximada sin flyweight: " << memoryWithoutFlyweight << " bytes" << std::endl;
        std::cout << "Memoria aproximada con flyweight: " << memoryWithFlyweight << " bytes" << std::endl;
        std::cout << "Ahorro de memoria aproximado: " 
                  << (memoryWithoutFlyweight - memoryWithFlyweight) << " bytes ("
                  << (100.0 * (memoryWithoutFlyweight - memoryWithFlyweight) / memoryWithoutFlyweight)
                  << "%)" << std::endl;
    }
};

int main() {
    // Semilla para números aleatorios
    srand(static_cast<unsigned int>(time(nullptr)));
    
    Forest forest;
    
    // Generamos un bosque con muchos árboles (solo algunos tipos diferentes)
    forest.generateRandomForest(1000, 100, 100);
    
    // Verificamos la eficiencia del patrón
    forest.render();
    
    return 0;
}`,
      explanation: [
        { line: 14, text: 'Usamos std::move para transferir la propiedad de los strings, evitando copias innecesarias.' },
        { line: 27, text: 'Utilizamos std::shared_ptr para gestionar automáticamente la memoria de los flyweights.' },
        { line: 36, text: 'Usamos el operador [] con treeTypes que inserta un valor predeterminado (nullptr) si no existe la clave.' },
        { line: 37, text: 'Verificamos si el puntero es nulo (!type) y solo entonces creamos un nuevo TreeType.' },
        { line: 38, text: 'std::make_shared crea y gestiona el objeto de forma más eficiente que crear con new y luego shared_ptr.' },
        { line: 55, text: 'La clase Tree ahora usa shared_ptr para el tipo, facilitando la gestión de memoria.' },
        { line: 63, text: 'Añadimos una clase TreeGenerator para crear árboles aleatorios, demostrando mejor el patrón.' },
        { line: 65, text: 'Método para generar posiciones aleatorias, devolviendo un std::pair.' },
        { line: 69, text: 'Método para generar escalas aleatorias dentro de un rango.' },
        { line: 73, text: 'Método para seleccionar aleatoriamente un tipo de árbol de una lista predefinida.' },
        { line: 107, text: 'Método para generar un bosque aleatorio con un número especificado de árboles.' },
        { line: 122, text: 'Cálculo del ahorro de memoria para demostrar la eficiencia del patrón Flyweight.' },
        { line: 138, text: 'Inicializamos la semilla para números aleatorios.' },
        { line: 142, text: 'Generamos un bosque con 1000 árboles aleatorios para demostrar la eficiencia del patrón.' }
      ]
    },
    
    java: {
      code: `import java.util.*;

// Clase Flyweight - almacena el estado intrínseco compartido
class TreeType {
    private final String name;
    private final String color;
    private final String texture;
    
    public TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }
    
    public void render(int x, int y, double scale) {
        System.out.println("Renderizando árbol tipo '" + name + "' con color " + color + 
                           " y textura " + texture + " en posición (" + x + "," + y + 
                           ") con escala " + scale);
    }
}

// Fábrica Flyweight - gestiona la creación y reutilización de flyweights
class TreeFactory {
    private static final Map<String, TreeType> treeTypes = new HashMap<>();
    
    public static TreeType getTreeType(String name, String color, String texture) {
        // Crear clave única para este tipo de árbol
        String key = name + "_" + color + "_" + texture;
        
        // Buscar o crear el tipo de árbol
        return treeTypes.computeIfAbsent(key, k -> {
            System.out.println("Creado nuevo tipo de árbol: " + key);
            return new TreeType(name, color, texture);
        });
    }
    
    public static int getCount() {
        return treeTypes.size();
    }
}

// Objeto contextual que utiliza el flyweight
class Tree {
    private final int x;
    private final int y;
    private final double scale;
    private final TreeType type;
    
    public Tree(int x, int y, double scale, TreeType type) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.type = type;
    }
    
    public void render() {
        type.render(x, y, scale);
    }
}

// Generador aleatorio de árboles
class TreeGenerator {
    private static final Random random = new Random();
    
    public static int[] randomPosition(int maxX, int maxY) {
        return new int[] {random.nextInt(maxX), random.nextInt(maxY)};
    }
    
    public static double randomScale(double min, double max) {
        return min + (random.nextDouble() * (max - min));
    }
    
    public static String randomTreeType() {
        String[] types = {"Pino", "Roble", "Abeto", "Abedul", "Sauce"};
        return types[random.nextInt(types.length)];
    }
    
    public static String randomColor() {
        String[] colors = {"Verde", "Verde oscuro", "Verde azulado", "Verde amarillento"};
        return colors[random.nextInt(colors.length)];
    }
    
    public static String randomTexture() {
        String[] textures = {"Rugosa", "Agrietada", "Lisa", "Escamosa"};
        return textures[random.nextInt(textures.length)];
    }
}

// Bosque - contenedor de árboles
class Forest {
    private final List<Tree> trees = new ArrayList<>();
    
    public void plantTree(int x, int y, double scale, String name, String color, String texture) {
        TreeType type = TreeFactory.getTreeType(name, color, texture);
        Tree tree = new Tree(x, y, scale, type);
        trees.add(tree);
    }
    
    public void generateRandomForest(int count, int maxX, int maxY) {
        for (int i = 0; i < count; i++) {
            int[] position = TreeGenerator.randomPosition(maxX, maxY);
            double scale = TreeGenerator.randomScale(0.8, 1.5);
            String type = TreeGenerator.randomTreeType();
            String color = TreeGenerator.randomColor();
            String texture = TreeGenerator.randomTexture();
            
            plantTree(position[0], position[1], scale, type, color, texture);
        }
    }
    
    public void render() {
        // Solo mostramos unos pocos árboles si hay muchos
        int displayLimit = Math.min(10, trees.size());
        for (int i = 0; i < displayLimit; i++) {
            trees.get(i).render();
        }
        
        if (trees.size() > displayLimit) {
            System.out.println("... y " + (trees.size() - displayLimit) + " árboles más");
        }
        
        System.out.println("Total de tipos de árboles únicos: " + TreeFactory.getCount() + 
                           " para " + trees.size() + " árboles");
        
        // Cálculo aproximado de memoria ahorrada (solo para ilustración)
        long memoryWithoutFlyweight = trees.size() * (40 + 80); // Aproximación: 40 bytes/Tree + 80 bytes/TreeType
        long memoryWithFlyweight = trees.size() * 40 + TreeFactory.getCount() * 80;
        
        System.out.println("Memoria aproximada sin flyweight: " + memoryWithoutFlyweight + " bytes");
        System.out.println("Memoria aproximada con flyweight: " + memoryWithFlyweight + " bytes");
        System.out.println("Ahorro de memoria aproximado: " + 
                          (memoryWithoutFlyweight - memoryWithFlyweight) + " bytes (" + 
                          (100.0 * (memoryWithoutFlyweight - memoryWithFlyweight) / memoryWithoutFlyweight) + 
                          "%)");
    }
}

// Clase principal para demostración
public class FlyweightDemo {
    public static void main(String[] args) {
        Forest forest = new Forest();
        
        // Generamos un bosque con muchos árboles (solo algunos tipos diferentes)
        forest.generateRandomForest(1000, 100, 100);
        
        // Renderizamos el bosque para ver la eficiencia del patrón
        forest.render();
    }
}`,
      explanation: [
        { line: 3, text: 'La clase TreeType es inmutable (con campos final), adecuada para flyweights compartidos.' },
        { line: 21, text: 'La fábrica usa un mapa estático para almacenar y compartir los flyweights entre todas las instancias.' },
        { line: 29, text: 'Usamos computeIfAbsent, una característica de Java 8+ que comprueba y crea el valor atómicamente.' },
        { line: 42, text: 'La clase Tree contiene el estado extrínseco (posición, escala) y una referencia al flyweight.' },
        { line: 57, text: 'Utilizamos la clase Random de Java para generar valores aleatorios.' },
        { line: 85, text: 'La clase Forest usa ArrayList para almacenar los árboles del bosque.' },
        { line: 98, text: 'Método para generar un bosque aleatorio con opciones variadas.' },
        { line: 110, text: 'Limitamos la visualización a 10 árboles para no saturar la consola.' },
        { line: 119, text: 'Mostramos estadísticas sobre el ahorro de memoria para ilustrar la eficiencia del patrón.' },
        { line: 122, text: 'Calculamos una aproximación del uso de memoria con y sin el patrón Flyweight.' },
        { line: 134, text: 'La clase FlyweightDemo contiene el método main para ejecutar la demostración.' },
        { line: 138, text: 'Generamos un bosque con 1000 árboles pero pocos tipos únicos para mostrar el beneficio del patrón.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Utiliza punteros crudos y gestión manual de memoria, lo que requiere implementar un destructor para liberar los recursos.',
      cppModern: 'Emplea smart pointers (shared_ptr) para gestión automática de memoria, eliminando la necesidad de destructor explícito y reduciendo riesgos de fugas.',
      java: 'La gestión de memoria es automática gracias al recolector de basura. Los objetos se liberan cuando no hay referencias a ellos.'
    },
    {
      title: 'Optimización y rendimiento',
      cppTraditional: 'Enfoque básico con mapa de búsqueda. Menos optimizado pero conceptualmente claro.',
      cppModern: 'Añade optimizaciones como std::move para transferencia de datos y cálculos del ahorro de memoria para demostrar la eficiencia.',
      java: 'Usa características modernas como computeIfAbsent para búsqueda y creación atómica, con un buen equilibrio entre claridad y rendimiento.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'Diseño relativamente rígido centrado en la funcionalidad principal del patrón.',
      cppModern: 'Mayor flexibilidad con generador aleatorio para demostrar escenarios del mundo real con gran número de objetos.',
      java: 'Diseño modular con generador aleatorio y limitación inteligente de la visualización para manejar grandes conjuntos de datos.'
    }
  ],
  
  theory: {
    background: 'El patrón Flyweight fue introducido en 1990 como parte de los 23 patrones del Gang of Four (GoF). Se inspiró en técnicas de optimización utilizadas en sistemas gráficos y editores de texto para gestionar grandes cantidades de objetos con recursos limitados.',
    problem: 'Cuando una aplicación utiliza un gran número de objetos que tienen partes de su estado en común, mantener una instancia separada para cada objeto puede resultar prohibitivamente costoso en términos de memoria. Por ejemplo, un editor de texto que represente cada carácter como un objeto completo o un videojuego con miles de árboles idénticos.',
    solution: 'El patrón Flyweight resuelve este problema separando el estado de un objeto en dos partes: estado intrínseco (compartido) y estado extrínseco (contextual). Las partes compartidas se mantienen en objetos Flyweight que pueden ser reutilizados entre múltiples objetos contextuales, reduciendo significativamente el consumo de memoria.',
    applicability: [
      'Cuando la aplicación utiliza un gran número de objetos que tienen partes de estado duplicadas.',
      'Cuando el uso de memoria es crítico para el rendimiento de la aplicación.',
      'Cuando la mayoría del estado del objeto puede hacerse extrínseco (contextual).',
      'Cuando grupos de objetos pueden ser reemplazados por relativamente pocos objetos compartidos una vez que se elimina el estado extrínseco.',
      'Cuando la aplicación no depende de la identidad de los objetos, ya que los flyweights comparten instancias.'
    ],
    benefits: [
      'Reduce drásticamente el consumo de memoria cuando se trabaja con un gran número de objetos similares.',
      'Centraliza el estado común en un solo lugar, facilitando actualizaciones y mantenimiento.',
      'Puede mejorar el rendimiento en sistemas con recursos limitados o aplicaciones que necesitan escalar a grandes números de objetos.',
      'Permite la representación de estructuras jerárquicas complejas con menos objetos.',
      'Combina bien con otros patrones como Composite para estructuras aún más eficientes.'
    ],
    drawbacks: [
      'Añade complejidad al código debido a la necesidad de separar estado intrínseco y extrínseco.',
      'La gestión de la fábrica de flyweights añade una capa adicional de indirección.',
      'Puede complicar el seguimiento de los cambios de estado, ya que un cambio en un flyweight afecta a todos los objetos que lo utilizan.',
      'El rendimiento puede verse afectado negativamente si el contexto (estado extrínseco) es demasiado grande o costoso de transferir en cada operación.',
      'No es adecuado cuando hay pocas oportunidades para compartir estado o cuando los objetos tienen estados únicos principalmente.'
    ]
  }
};

export default flyweightPattern;
