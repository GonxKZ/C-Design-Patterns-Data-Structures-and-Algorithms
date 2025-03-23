const bridgePattern = {
  id: 'bridge',
  name: 'Bridge',
  category: 'structural',
  description: 'El patrón Bridge separa una abstracción de su implementación para que ambas puedan variar independientemente. Permite dividir una clase grande o un conjunto de clases estrechamente relacionadas en dos jerarquías separadas—abstracción e implementación—que pueden desarrollarse independientemente.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Implementación
class DeviceImplementation {
public:
    virtual ~DeviceImplementation() {}
    virtual void turnOn() = 0;
    virtual void turnOff() = 0;
    virtual void setVolume(int percent) = 0;
    virtual void setChannel(int channel) = 0;
    virtual int getVolume() const = 0;
    virtual int getChannel() const = 0;
    virtual bool isEnabled() const = 0;
};

// Implementación concreta: TV
class TV : public DeviceImplementation {
private:
    bool enabled;
    int volume;
    int channel;

public:
    TV() : enabled(false), volume(30), channel(1) {}
    
    void turnOn() override {
        enabled = true;
        std::cout << "TV: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "TV: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        volume = percent;
        std::cout << "TV: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int newChannel) override {
        channel = newChannel;
        std::cout << "TV: canal cambiado a " << channel << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Implementación concreta: Radio
class Radio : public DeviceImplementation {
private:
    bool enabled;
    int volume;
    int channel; // Frecuencia de la emisora

public:
    Radio() : enabled(false), volume(20), channel(93) {}
    
    void turnOn() override {
        enabled = true;
        std::cout << "Radio: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "Radio: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        volume = percent;
        std::cout << "Radio: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int frequency) override {
        channel = frequency;
        std::cout << "Radio: frecuencia cambiada a " << channel << " MHz" << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Abstracción
class RemoteControl {
protected:
    DeviceImplementation* device;
    
public:
    RemoteControl(DeviceImplementation* device) : device(device) {}
    virtual ~RemoteControl() {}
    
    void togglePower() {
        if (device->isEnabled()) {
            device->turnOff();
        } else {
            device->turnOn();
        }
    }
    
    void volumeUp() {
        device->setVolume(device->getVolume() + 10);
    }
    
    void volumeDown() {
        device->setVolume(device->getVolume() - 10);
    }
    
    void channelUp() {
        device->setChannel(device->getChannel() + 1);
    }
    
    void channelDown() {
        device->setChannel(device->getChannel() - 1);
    }
};

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl : public RemoteControl {
public:
    AdvancedRemoteControl(DeviceImplementation* device) : RemoteControl(device) {}
    
    void mute() {
        device->setVolume(0);
        std::cout << "Dispositivo silenciado" << std::endl;
    }
    
    void setChannel(int channel) {
        device->setChannel(channel);
        std::cout << "Canal configurado directamente a " << channel << std::endl;
    }
};

// Función de demostración
void clientCode() {
    std::cout << "Ejemplo con TV y control básico:" << std::endl;
    TV* tv = new TV();
    RemoteControl* basicRemote = new RemoteControl(tv);
    
    basicRemote->togglePower();
    basicRemote->volumeUp();
    basicRemote->channelUp();
    basicRemote->channelUp();
    
    std::cout << "\nEjemplo con Radio y control avanzado:" << std::endl;
    Radio* radio = new Radio();
    AdvancedRemoteControl* advancedRemote = new AdvancedRemoteControl(radio);
    
    advancedRemote->togglePower();
    advancedRemote->volumeUp();
    advancedRemote->setChannel(101);
    advancedRemote->mute();
    
    // Limpieza
    delete basicRemote;
    delete tv;
    delete advancedRemote;
    delete radio;
}

int main() {
    clientCode();
    return 0;
}`,
      explanation: [
        { line: 4, text: 'Definimos la interfaz de implementación DeviceImplementation que define los métodos que deben implementar todos los dispositivos.' },
        { line: 15, text: 'Implementación concreta: TV que implementa la interfaz DeviceImplementation.' },
        { line: 57, text: 'Implementación concreta: Radio que también implementa la interfaz DeviceImplementation.' },
        { line: 99, text: 'Abstracción: RemoteControl que utiliza un puntero a la implementación.' },
        { line: 104, text: 'Constructor que recibe un puntero a la implementación, estableciendo el puente.' },
        { line: 107, text: 'Método togglePower que utiliza los métodos de la implementación.' },
        { line: 129, text: 'Abstracción refinada: AdvancedRemoteControl que extiende la funcionalidad básica.' },
        { line: 142, text: 'Función de demostración que muestra cómo usar las abstracciones con diferentes implementaciones.' },
        { line: 144, text: 'Creamos una TV y un control básico.' },
        { line: 151, text: 'Creamos una Radio y un control avanzado.' },
        { line: 159, text: 'Liberamos la memoria manualmente ya que estamos usando punteros crudos.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <functional>

// Implementación
class DeviceImplementation {
public:
    virtual ~DeviceImplementation() = default;
    virtual void turnOn() = 0;
    virtual void turnOff() = 0;
    virtual void setVolume(int percent) = 0;
    virtual void setChannel(int channel) = 0;
    virtual int getVolume() const = 0;
    virtual int getChannel() const = 0;
    virtual bool isEnabled() const = 0;
};

// Implementación concreta: TV
class TV : public DeviceImplementation {
private:
    bool enabled{false};
    int volume{30};
    int channel{1};

public:
    void turnOn() override {
        enabled = true;
        std::cout << "TV: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "TV: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        volume = std::clamp(percent, 0, 100);
        std::cout << "TV: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int newChannel) override {
        channel = newChannel;
        std::cout << "TV: canal cambiado a " << channel << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Implementación concreta: Radio
class Radio : public DeviceImplementation {
private:
    bool enabled{false};
    int volume{20};
    int channel{93}; // Frecuencia de la emisora

public:
    void turnOn() override {
        enabled = true;
        std::cout << "Radio: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "Radio: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        volume = std::clamp(percent, 0, 100);
        std::cout << "Radio: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int frequency) override {
        channel = frequency;
        std::cout << "Radio: frecuencia cambiada a " << channel << " MHz" << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Abstracción
class RemoteControl {
protected:
    std::shared_ptr<DeviceImplementation> device;
    
public:
    explicit RemoteControl(std::shared_ptr<DeviceImplementation> dev) : device(std::move(dev)) {}
    virtual ~RemoteControl() = default;
    
    void togglePower() {
        if (device->isEnabled()) {
            device->turnOff();
        } else {
            device->turnOn();
        }
    }
    
    void volumeUp() {
        device->setVolume(device->getVolume() + 10);
    }
    
    void volumeDown() {
        device->setVolume(device->getVolume() - 10);
    }
    
    void channelUp() {
        device->setChannel(device->getChannel() + 1);
    }
    
    void channelDown() {
        device->setChannel(device->getChannel() - 1);
    }
};

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl : public RemoteControl {
public:
    explicit AdvancedRemoteControl(std::shared_ptr<DeviceImplementation> dev) : RemoteControl(std::move(dev)) {}
    
    void mute() {
        device->setVolume(0);
        std::cout << "Dispositivo silenciado" << std::endl;
    }
    
    void setChannel(int channel) {
        device->setChannel(channel);
        std::cout << "Canal configurado directamente a " << channel << std::endl;
    }
};

// Función de demostración con Smart Pointers
void clientCode() {
    std::cout << "Ejemplo con TV y control básico:" << std::endl;
    auto tv = std::make_shared<TV>();
    auto basicRemote = std::make_unique<RemoteControl>(tv);
    
    basicRemote->togglePower();
    basicRemote->volumeUp();
    basicRemote->channelUp();
    basicRemote->channelUp();
    
    std::cout << "\nEjemplo con Radio y control avanzado:" << std::endl;
    auto radio = std::make_shared<Radio>();
    auto advancedRemote = std::make_unique<AdvancedRemoteControl>(radio);
    
    advancedRemote->togglePower();
    advancedRemote->volumeUp();
    advancedRemote->setChannel(101);
    advancedRemote->mute();
    
    // No es necesario eliminar explícitamente, los smart pointers se encargan automáticamente
}

// Ejemplo de uso con un dispositivo compartido
void sharedDeviceExample() {
    std::cout << "\nEjemplo de dispositivo compartido:" << std::endl;
    auto tv = std::make_shared<TV>();
    
    auto basicRemote = std::make_unique<RemoteControl>(tv);
    auto advancedRemote = std::make_unique<AdvancedRemoteControl>(tv);
    
    basicRemote->togglePower(); // Enciende la TV
    advancedRemote->setChannel(5); // Ambos controles operan sobre la misma TV
    basicRemote->volumeUp(); // Ambos controles afectan al mismo volumen
}

int main() {
    clientCode();
    sharedDeviceExample();
    return 0;
}`,
      explanation: [
        { line: 3, text: 'Incluimos bibliotecas para smart pointers y funciones auxiliares.' },
        { line: 7, text: 'Usamos = default para el destructor virtual, siguiendo las mejores prácticas de C++ moderno.' },
        { line: 19, text: 'Inicializamos las variables miembro con inicializadores en línea (C++11).' },
        { line: 35, text: 'Utilizamos std::clamp para asegurar que el volumen esté dentro del rango válido.' },
        { line: 99, text: 'Usamos std::shared_ptr para el dispositivo, permitiendo que múltiples controles compartan el mismo dispositivo.' },
        { line: 101, text: 'El constructor usa explicit para evitar conversiones implícitas no deseadas y std::move para transferencia eficiente.' },
        { line: 102, text: 'Usamos = default para el destructor virtual, simplificando el código.' },
        { line: 132, text: 'La abstracción refinada también utiliza std::move para transferencia eficiente del puntero compartido.' },
        { line: 146, text: 'Creamos objetos usando std::make_shared y std::make_unique, que es más eficiente y seguro.' },
        { line: 159, text: 'No necesitamos delete explícito, los smart pointers manejan automáticamente la liberación de memoria.' },
        { line: 164, text: 'Ejemplo adicional que muestra cómo múltiples controles pueden operar sobre el mismo dispositivo.' },
        { line: 167, text: 'Un dispositivo compartido (tv) es usado por dos controles diferentes, demostrando la flexibilidad del patrón.' }
      ]
    },
    
    java: {
      code: `import java.util.function.Consumer;

// Interfaz de implementación
interface DeviceImplementation {
    void turnOn();
    void turnOff();
    void setVolume(int percent);
    void setChannel(int channel);
    int getVolume();
    int getChannel();
    boolean isEnabled();
}

// Implementación concreta: TV
class TV implements DeviceImplementation {
    private boolean enabled = false;
    private int volume = 30;
    private int channel = 1;
    
    @Override
    public void turnOn() {
        enabled = true;
        System.out.println("TV: encendida");
    }
    
    @Override
    public void turnOff() {
        enabled = false;
        System.out.println("TV: apagada");
    }
    
    @Override
    public void setVolume(int percent) {
        volume = Math.max(0, Math.min(100, percent));
        System.out.println("TV: volumen establecido a " + volume + "%");
    }
    
    @Override
    public void setChannel(int newChannel) {
        channel = newChannel;
        System.out.println("TV: canal cambiado a " + channel);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public int getChannel() {
        return channel;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

// Implementación concreta: Radio
class Radio implements DeviceImplementation {
    private boolean enabled = false;
    private int volume = 20;
    private int channel = 93; // Frecuencia de la emisora
    
    @Override
    public void turnOn() {
        enabled = true;
        System.out.println("Radio: encendida");
    }
    
    @Override
    public void turnOff() {
        enabled = false;
        System.out.println("Radio: apagada");
    }
    
    @Override
    public void setVolume(int percent) {
        volume = Math.max(0, Math.min(100, percent));
        System.out.println("Radio: volumen establecido a " + volume + "%");
    }
    
    @Override
    public void setChannel(int frequency) {
        channel = frequency;
        System.out.println("Radio: frecuencia cambiada a " + channel + " MHz");
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public int getChannel() {
        return channel;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

// Abstracción
class RemoteControl {
    protected DeviceImplementation device;
    
    public RemoteControl(DeviceImplementation device) {
        this.device = device;
    }
    
    public void togglePower() {
        if (device.isEnabled()) {
            device.turnOff();
        } else {
            device.turnOn();
        }
    }
    
    public void volumeUp() {
        device.setVolume(device.getVolume() + 10);
    }
    
    public void volumeDown() {
        device.setVolume(device.getVolume() - 10);
    }
    
    public void channelUp() {
        device.setChannel(device.getChannel() + 1);
    }
    
    public void channelDown() {
        device.setChannel(device.getChannel() - 1);
    }
}

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl extends RemoteControl {
    public AdvancedRemoteControl(DeviceImplementation device) {
        super(device);
    }
    
    public void mute() {
        device.setVolume(0);
        System.out.println("Dispositivo silenciado");
    }
    
    public void setChannel(int channel) {
        device.setChannel(channel);
        System.out.println("Canal configurado directamente a " + channel);
    }
}

// Uso con expresiones lambda para operaciones en secuencia
class RemoteControlOperations {
    public static void performOperations(RemoteControl remote, Consumer<RemoteControl> operations) {
        operations.accept(remote);
    }
}

// Clase de demostración
public class BridgeDemo {
    public static void main(String[] args) {
        System.out.println("Ejemplo con TV y control básico:");
        DeviceImplementation tv = new TV();
        RemoteControl basicRemote = new RemoteControl(tv);
        
        basicRemote.togglePower();
        basicRemote.volumeUp();
        basicRemote.channelUp();
        basicRemote.channelUp();
        
        System.out.println("\nEjemplo con Radio y control avanzado:");
        DeviceImplementation radio = new Radio();
        AdvancedRemoteControl advancedRemote = new AdvancedRemoteControl(radio);
        
        advancedRemote.togglePower();
        advancedRemote.volumeUp();
        advancedRemote.setChannel(101);
        advancedRemote.mute();
        
        // Ejemplo de operaciones encadenadas con lambdas
        System.out.println("\nOperaciones encadenadas con lambdas:");
        RemoteControlOperations.performOperations(basicRemote, remote -> {
            remote.togglePower(); // Apaga la TV
            remote.togglePower(); // La vuelve a encender
            remote.channelUp();
            remote.volumeUp();
        });
        
        // Ejemplo de dispositivo compartido
        System.out.println("\nEjemplo de dispositivo compartido:");
        DeviceImplementation sharedTV = new TV();
        RemoteControl remoteInLivingRoom = new RemoteControl(sharedTV);
        AdvancedRemoteControl remoteInBedroom = new AdvancedRemoteControl(sharedTV);
        
        remoteInLivingRoom.togglePower(); // Enciende la TV
        remoteInBedroom.setChannel(5); // Ambos controles operan sobre la misma TV
        remoteInLivingRoom.volumeUp(); // Ambos controles afectan al mismo volumen
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos la interfaz Consumer para usar lambdas en el ejemplo avanzado.' },
        { line: 4, text: 'Definimos la interfaz DeviceImplementation que establece los métodos requeridos para implementaciones concretas.' },
        { line: 14, text: 'La clase TV implementa la interfaz DeviceImplementation.' },
        { line: 31, text: 'Usamos Math.max y Math.min para asegurar que el volumen esté dentro del rango válido.' },
        { line: 56, text: 'La clase Radio implementa la misma interfaz, permitiendo diferentes implementaciones.' },
        { line: 98, text: 'La clase RemoteControl es la abstracción que usa la implementación a través de la interfaz.' },
        { line: 126, text: 'AdvancedRemoteControl extiende la abstracción básica, añadiendo funcionalidades adicionales.' },
        { line: 142, text: 'Clase auxiliar que muestra cómo usar lambdas con el patrón Bridge para encadenar operaciones.' },
        { line: 144, text: 'Método estático que acepta un control remoto y un Consumer que define operaciones a realizar.' },
        { line: 165, text: 'En el ejemplo principal, creamos las implementaciones y abstracciones.' },
        { line: 179, text: 'Ejemplo avanzado que usa lambdas para encadenar operaciones en un control remoto.' },
        { line: 188, text: 'Ejemplo adicional que demuestra cómo múltiples controles pueden operar sobre el mismo dispositivo.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Usa punteros crudos y delete explícito, lo que puede llevar a fugas de memoria si no se maneja correctamente.',
      cppModern: 'Utiliza smart pointers (shared_ptr y unique_ptr) para gestión automática de memoria, evitando fugas y simplificando el código.',
      java: 'La gestión de memoria es automática gracias al recolector de basura, eliminando la necesidad de liberar memoria manualmente.'
    },
    {
      title: 'Seguridad y robustez',
      cppTraditional: 'Más propenso a errores como desreferenciación de punteros nulos o fugas de memoria si no se tiene cuidado.',
      cppModern: 'Mayor seguridad con smart pointers, valores por defecto y std::clamp para validación de rangos, minimizando errores potenciales.',
      java: 'Proporciona comprobación de tipos en tiempo de compilación y manejo de nulos más seguro con la posibilidad de usar Optional en versiones recientes.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'La implementación básica ya soporta la separación de abstracción e implementación, pero con menos opciones de extensión.',
      cppModern: 'Mayor flexibilidad gracias a los punteros compartidos que permiten que múltiples abstracciones utilicen la misma implementación concurrentemente.',
      java: 'Alta extensibilidad a través de interfaces y clases abstractas, con opciones adicionales como expresiones lambda para operaciones compuestas.'
    }
  ],
  
  theory: {
    background: 'El patrón Bridge es uno de los 23 patrones de diseño del Gang of Four (GoF). Tiene sus raíces en el principio "preferir composición sobre herencia" y en la idea de separar interfaz de implementación.',
    problem: 'Cuando una clase tiene múltiples dimensiones de variación, la herencia puede llevar a una explosión de subclases. Por ejemplo, si tenemos N formas y M plataformas, necesitaríamos N×M clases diferentes usando herencia tradicional. Además, añadir una nueva dimensión requiere modificar toda la jerarquía de clases.',
    solution: 'El patrón Bridge divide la clase en dos jerarquías separadas: la abstracción (qué hace el objeto) y la implementación (cómo lo hace). La abstracción contiene una referencia a la implementación, permitiendo que ambas varíen independientemente. Esto permite combinar N abstracciones con M implementaciones usando sólo N+M clases.',
    applicability: [
      'Cuando se desea evitar un vínculo permanente entre la abstracción y su implementación.',
      'Cuando tanto la abstracción como la implementación deben ser extensibles mediante subclases.',
      'Cuando los cambios en la implementación no deben afectar al código cliente.',
      'Cuando se tiene una proliferación de clases debido a una jerarquía que combina múltiples dimensiones de variación.',
      'Cuando se quiere compartir una implementación entre múltiples objetos.'
    ],
    benefits: [
      'Desacopla la interfaz de la implementación, permitiendo que evolucionen por separado.',
      'Mejora la extensibilidad: se pueden añadir nuevas abstracciones e implementaciones independientemente.',
      'Oculta detalles de implementación al cliente, siguiendo el principio de encapsulación.',
      'Reduce el número de clases necesarias en comparación con la herencia múltiple.',
      'Facilita la creación de plataformas cruzadas y sistemas independientes del sistema operativo.'
    ],
    drawbacks: [
      'Aumenta la complejidad del código debido a la introducción de nuevas interfaces y clases.',
      'Puede resultar excesivo para problemas simples donde la herencia directa sería más sencilla.',
      'Requiere un diseño inicial cuidadoso para identificar correctamente las abstracciones e implementaciones.',
      'Puede ser difícil de entender para desarrolladores no familiarizados con el patrón.',
      'La indirección adicional puede tener un pequeño impacto en el rendimiento.'
    ]
  }
};

export default bridgePattern;
