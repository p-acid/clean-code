---
sidebar_position: 8
---

# 8장. 경계

<br/>

## 들어가며

---

시스템에 들어가는 모든 소프트웨어를 직접 개발하는 경우는 드물기 때문에, 외부 코드를 우리 코드에 깔끔하게 통합해야만 한다.

<br/>

## 외부 코드 사용하기

---

인터페이스 **제공자**와 **사용자** 간에는 다음과 같은 관계성이 보인다.

- 제공자 입장에선 좀 더 다양한 환경에서의 호환성을 도모하며 다양한 사용성을 지향한다.
- 사용자 입장에선 그들의 사용처에 맞는 특수한 인터페이스를 원한다.

이것을 **경계에서의 긴장**이라고 한다.

다음은 `java.util.Map` 이다.

- `Map` 객체가 갖는 기능성과 유연성은 확실히 유용하지만, 그만큼 위험(삭제하거나 저장 유형이 바뀔 가능성)도 크다.

```java
clear() void – Map
containsKey(Object key) boolean – Map
containsValue(Object value) boolean – Map
clear() void – Map
containsKey(Object key) boolean – Map
containsValue(Object value) boolean – Map
entrySet() Set – Map
equals(Object o) boolean – Map
get(Object key) Object – Map
getClass() Class<? extends Object> – Object
hashCode() int – Map
isEmpty() boolean – Map
keySet() Set – Map
notify() void – Object
notifyAll() void – Object
put(Object key, Object value) Object – Map
putAll(Map t) void – Map
remove(Object key) Object – Map
size() int – Map
toString() String – Object
values() Collection – Map
wait() void – Object
wait(long timeout) void – Object
wait(long timeout, int nanos) void – Object
```

만약 `Sensor` 클래스를 저장하는 `Map` 객체를 사용한다면 다음과 같은 형태일 것이다.

```java
Map sensors = new HashMap();
Sensor s = (Sensor) sensors.get(sensorId);
```

하지만 위 경우 `Map` 객체를 사용하는 클라이언트가 반환되는 객체를 올바른 유형으로 변경할 책임을 갖는다.

- 이는 다음과 같이 제네릭을 통해 해결할 수 있다.

```java
Map<Sensor> sensors = new HashMap<Sensor>();
Sensor s = sensors.get(sensorId);
```

하지만 이 경우도 `Map` 객체가 필요 이상의 기능을 제공하는 것을 막지 못한다.

- 결국 제일 좋은 방식은 래핑이다.

```java
public class Sensors {
    // 경계의 인터페이스(이 경우에는 Map의 메서드)는 숨겨진다.
    // Map의 인터페이스가 변경되더라도 여파를 최소화할 수 있다. 예를 들어 Generic을 사용하던 직접 캐스팅하던 그건 구현 디테일이며 Sensor클래스를 사용하는 측에서는 신경쓸 필요가 없다.
    // 이는 또한 사용자의 목적에 딱 맞게 디자인되어 있으므로 이해하기 쉽고 잘못 사용하기 어렵게 된다.

    private Map sensors = new HashMap();

    public Sensor getById(String id) {
        return (Sensor)sensors.get(id);
    }
    //snip
}
```

`Map` 클래스를 사용하라는 말이 아니며, `Map` 과 같은 **경계 인터페이스**를 사용할 땐 이를 이용하는 클래스나 클래스 계열 밖으로 노출시키지 말라는 뜻이다.

<br/>

## 경계 살피고 익히기

---

외부 패키지를 가져와 사용할 땐, 우리 자신을 위해 사용할 코드를 테스트하는 편이 바람직하다.

- 외부 코드를 익히는 것과 외부 코드를 통합하는 것은 어려우며 동시에 하는 것은 더 어렵다.
- 다르게 접근하면 외부 코드 호출 대신 간단한 테스트 케이스를 우리쪽 코드에 작성하여 외부 코드를 익히는 방식도 있다.
  - 이를 **학습 테스트**라 부른다.
  - 학습 테스트는 **API 사용** 목적에 초점을 둔다.

<br/>

## log4j 익히기

---

```java
// 1.
// 우선 log4j 라이브러리를 다운받자.
// 고민 많이 하지 말고 본능에 따라 "hello"가 출력되길 바라면서 아래의 테스트 코드를 작성해보자.
@Test
public void testLogCreate() {
    Logger logger = Logger.getLogger("MyLogger");
    logger.info("hello");
}
// 2.
// 위 테스트는 "Appender라는게 필요하다"는 에러를 뱉는다.
// 조금 더 읽어보니 ConsoleAppender라는게 있는걸 알아냈다.
// 그래서 ConsoleAppender라는 객체를 만들어 넣어줘봤다.
@Test
public void testLogAddAppender() {
    Logger logger = Logger.getLogger("MyLogger");
    ConsoleAppender appender = new ConsoleAppender();
    logger.addAppender(appender);
    logger.info("hello");
}
// 3.
// 위와 같이 하면 "Appender에 출력 스트림이 없다"고 한다.
// 이상하다. 가지고 있는게 이성적일것 같은데...
// 구글의 도움을 빌려, 다음과 같이 해보았다.
@Test
public void testLogAddAppender() {
    Logger logger = Logger.getLogger("MyLogger");
    logger.removeAllAppenders();
    logger.addAppender(new ConsoleAppender(
        new PatternLayout("%p %t %m%n"),
        ConsoleAppender.SYSTEM_OUT));
    logger.info("hello");
}

// 성공했다. 하지만 ConsoleAppender를 만들어놓고 ConsoleAppender.SYSTEM_OUT을 받는건 이상하다.
// 그래서 빼봤더니 잘 돌아간다.
// 하지만 PatternLayout을 제거하니 돌아가지 않는다.
// 그래서 문서를 살펴봤더니 "ConsoleAppender의 기본 생성자는 unconfigured상태"란다.
// 명백하지도 않고 실용적이지도 않다... 버그이거나, 적어도 "일관적이지 않다"고 느껴진다.
```

<br/>

## 학습 테스트는 공짜 이상이다

---

어차피 API를 배워야하므로, 학습 테스트는 이해도를 높여주는 정확한 실험이다.

- 투자 노력 대비 성과가 더 크다.
  - 패키지 새 버전이 나오면 학습 테스트를 돌려 차이를 검증한다.
  - 학습이 필요하지 않든 실제 코드와 동일한 방식으로 인터페이스를 사용하는 테스트 케이스가 필요하다.

<br/>

## 아직 존재하지 않는 코드를 사용하기

---

아직 개발되지 않은 모듈이 필요한데, 기능은 커녕 인터페이스 조차 구현되지 않은 경우 임시 인터페이스를 정의하여 개발하는 방식도 있다.

```java
public interface Transimitter {
    public void transmit(SomeType frequency, OtherType stream);
}

public class FakeTransmitter implements Transimitter {
    public void transmit(SomeType frequency, OtherType stream) {
        // 실제 구현이 되기 전까지 더미 로직으로 대체
    }
}

// 경계 밖의 API
public class RealTransimitter {
    // 캡슐화된 구현
    ...
}

public class TransmitterAdapter extends RealTransimitter implements Transimitter {
    public void transmit(SomeType frequency, OtherType stream) {
        // RealTransimitter(외부 API)를 사용해 실제 로직을 여기에 구현.
        // Transmitter의 변경이 미치는 영향은 이 부분에 한정된다.
    }
}

public class CommunicationController {
    // Transmitter팀의 API가 제공되기 전에는 아래와 같이 사용한다.
    public void someMethod() {
        Transmitter transmitter = new FakeTransmitter();
        transmitter.transmit(someFrequency, someStream);
    }

    // Transmitter팀의 API가 제공되면 아래와 같이 사용한다.
    public void someMethod() {
        Transmitter transmitter = new TransmitterAdapter();
        transmitter.transmit(someFrequency, someStream);
    }
}

```

이와 같은 설계는 테스트 케이스도 편하며, API 인터페이스가 나오면 경계 테스트 케이스를 생성해 우리가 API를 올바르게 사용하는지 테스트할 수도 있다.

<br/>

## 깨끗한 경계

---

좋은 소프트웨어 디자인은 변경이 생길 경우 많은 재작업 없이 변경을 반영할 수 있는 디자인이다.

- 우리 내부 코드가 서드파티 코드를 많이 알지 못하게 막아야 한다.
- 우리가 컨트롤 할 수 있는 것에 의지하는게 그렇지 않은 것보다 낫다.
  - 그렇지 않으면 그것들이 우리를 컨트롤할 것이다.
- Map 객체를 래핑하든 Adapter를 사용해 우리 입맛에 맞게 인터페이스를 변경하든, 코드는 보기 편해지고 경계 인터페이스를 일관적으로 사용할 수 있게 해주며 그들의 변경에도 유연하게 대응할 수 있게 해준다.
