---
sidebar_position: 9
---

# 9장. 단위 테스트

<br/>

## 들어가며

---

애자일과 TDD(Test Driven Development) 덕택에 단위 테스트를 자동화하는 프로그래머들이 많아졌다.

하지만, 테스트를 추가하려고 급하게 서두르는 와중에 제대로 된 테스트 케이스를 작성해야 한다는 사실을 놓치고 있다.

<br/>

## TDD 법칙 세 가지

---

TDD의 세 가지 법칙은 다음과 같다.

1. 실패하는 단위 테스트를 작성할 때까지 실제 코드를 작성하지 않는다.
2. 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 단위 테스트를 작성한다.
3. 현재 실패하는 테스트를 통과할 정도로만 실제 코드를 작성한다.

위 법칙대로 수많은 테스트 코드가 생겨나고 방대한 테스트 코드가 심각한 관리 문제를 야기하기도 한다.

<br/>

## 깨끗한 테스트 코드 유지하기

---

테스트 코드를 막 짜도 좋다고 결정하고 쏟아 붓는 노력은 허사다.

- 지저분한 테스트 코드를 작성한다.
- 코드의 발전에 따라 테스트 코드도 발전해야 한다.
- 지저분한 테스트 코드는 발전 속도가 느리다.
- 점차 테스트 코드는 불만으로 자리잡고, 제 기능을 못하며 서비스의 품질을 낮춘다.

요점은 **테스트 코드는 실제 코드 못지 않게 중요하며** 사고와 설계에 주의가 필요하다는 점이다.

<br/>

### 테스트는 유연성, 유지 보수성, 재사용성을 제공한다

---

테스트 케이스는 **변경의 두려움을 없애기에** 코드에 유연성, 유지 보수성, 재사용성을 제공한다.

- 테스트 커버리지가 높을수록 공포는 줄어들며, 코드가 깔끔할 수록 변경 능력이 높아진다.

<br/>

## 깨끗한 테스트 코드

---

아래 두 가지 코드는 동일한 테스트를 수행하는 코드이다. 두 번째 코드가 첫 번째 코드를 개선한 코드로, 첫 번째 코드가 갖는 문제점은 다음과 같다.

- `PathParser` 라는 문자열을 `pagePath` 인스턴스로 변환하는 코드는 테스트와 무관하다.
- `responder` 객체를 생성하는 코드와 `response` 를 수집해 변환하는 코드 역시 잡음에 불과하다.
- 마지막으로 해당 코드는 읽는 사람을 고려하지 않고, 무관한 코드를 다 읽고 나서야 테스트 케이스를 이해할 수 있다.

```java
public void testGetPageHieratchyAsXml() throws Exception {
  crawler.addPage(root, PathParser.parse("PageOne"));
  crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
  crawler.addPage(root, PathParser.parse("PageTwo"));

  request.setResource("root");
  request.addInput("type", "pages");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("<name>PageOne</name>", xml);
  assertSubString("<name>PageTwo</name>", xml);
  assertSubString("<name>ChildOne</name>", xml);
}

public void testGetPageHieratchyAsXmlDoesntContainSymbolicLinks() throws Exception {
  WikiPage pageOne = crawler.addPage(root, PathParser.parse("PageOne"));
  crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
  crawler.addPage(root, PathParser.parse("PageTwo"));

  PageData data = pageOne.getData();
  WikiPageProperties properties = data.getProperties();
  WikiPageProperty symLinks = properties.set(SymbolicPage.PROPERTY_NAME);
  symLinks.set("SymPage", "PageTwo");
  pageOne.commit(data);

  request.setResource("root");
  request.addInput("type", "pages");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("<name>PageOne</name>", xml);
  assertSubString("<name>PageTwo</name>", xml);
  assertSubString("<name>ChildOne</name>", xml);
  assertNotSubString("SymPage", xml);
}

public void testGetDataAsHtml() throws Exception {
  crawler.addPage(root, PathParser.parse("TestPageOne"), "test page");

  request.setResource("TestPageOne"); request.addInput("type", "data");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("test page", xml);
  assertSubString("<Test", xml);
}
```

```java
public void testGetPageHierarchyAsXml() throws Exception {
  makePages("PageOne", "PageOne.ChildOne", "PageTwo");

  submitRequest("root", "type:pages");

  assertResponseIsXML();
  assertResponseContains(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
}

public void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {
  WikiPage page = makePage("PageOne");
  makePages("PageOne.ChildOne", "PageTwo");

  addLinkTo(page, "PageTwo", "SymPage");

  submitRequest("root", "type:pages");

  assertResponseIsXML();
  assertResponseContains(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
  assertResponseDoesNotContain("SymPage");
}

public void testGetDataAsXml() throws Exception {
  makePageWithContent("TestPageOne", "test page");

  submitRequest("TestPageOne", "type:data");

  assertResponseIsXML();
  assertResponseContains("test page", "<Test");
}
```

잡다하고 세세한 코드를 거의 다 없앴다는 사실에 주목하자.

테스트 코드는 **본론에 돌입해 진짜 필요한 자료 유형과 함수만 사용한다.**

<br/>

### 도메인에 특화된 테스트 언어

---

위 두 번째 코드는 **도메인에 특화된 언어(DSL)**로 테스트 코드를 구현하는 기법을 보여준다.

- 시스템 조작 API를 사용하는 대신 API 위에다 함수와 유틸리티를 구현한 후 그 함수와 유틸리티를 사용하므로 테스트 코드를 짜기도 읽기도 쉬워진다.
- 즉, 테스트를 구현하는 당사자와 독자를 도와주는 테스트 언어다.

숙련된 개발자라면 이처럼 자기 코드를 좀 더 간결하고 표현력이 풍부한 코드로 리팩터링해야 마땅하다.

<br/>

### 이중 표준

---

테스트 코드도 깨끗하고 간결하며 표현력이 풍부해야 하지만 **실제 코드만큼 효율적일 필요는 없다.**

```java
@Test
public void turnOnLoTempAlarmAtThreashold() throws Exception {
  hw.setTemp(WAY_TOO_COLD);
  controller.tic();
  assertTrue(hw.heaterState());
  assertTrue(hw.blowerState());
  assertFalse(hw.coolerState());
  assertFalse(hw.hiTempAlarm());
  assertTrue(hw.loTempAlarm());
}
```

위 코드는 세세한 사항(`tic` 함수는 무엇인가 등)이 아주 많다.

하지만 단지 시스템 최종 상태가 온도가 급강하했는지 그것만 신경써서 살펴보면, 점검하는 상태 이름과 상태 값을 비교하면서 테스트 코드를 읽기 어려움을 느낀다.

```java
@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertEquals("HBchL", hw.getState());
}
```

앞의 코드는 가독성을 크게 높인 코드다.

- 물론 위 `"HBchL"` 은 그릇된 정보를 피하라 원칙에 어긋나기도 하지만 여기서는 적절해 보인다.

```java
public String getState() {
  String state = "";
  state += heater ? "H" : "h";
  state += blower ? "B" : "b";
  state += cooler ? "C" : "c";
  state += hiTempAlarm ? "H" : "h";
  state += loTempAlarm ? "L" : "l";
  return state;
}
```

위와 같은 `StringBuffer` 는 보기에 흉하기에 실제 코드에서 피하게 되지만 테스트 케이스에선 유용할 때가 있다.

- 이것이 **이중 표준의 본질**이다.
  - 실제 환경에선 절대로 안 되지만 테스트 환경에서는 전혀 문제없는 방식이 있다는 것이다.
  - 대개 **메모리나 CPU 효율과 관련 있는 경우**이며, 코드의 깨끗함과는 **철저히 무관**하다.

<br/>

## 테스트 당 개념 하나

---

잡다한 개념을 연속으로 테스트하는 긴 함수를 피하자.

```java
 /**
 * addMonth() 메서드를 테스트하는 장황한 코드
 */
public void testAddMonths() {
  SerialDate d1 = SerialDate.createInstance(31, 5, 2004);

  SerialDate d2 = SerialDate.addMonths(1, d1);
  assertEquals(30, d2.getDayOfMonth());
  assertEquals(6, d2.getMonth());
  assertEquals(2004, d2.getYYYY());

  SerialDate d3 = SerialDate.addMonths(2, d1);
  assertEquals(31, d3.getDayOfMonth());
  assertEquals(7, d3.getMonth());
  assertEquals(2004, d3.getYYYY());

  SerialDate d4 = SerialDate.addMonths(1, SerialDate.addMonths(1, d1));
  assertEquals(30, d4.getDayOfMonth());
  assertEquals(7, d4.getMonth());
  assertEquals(2004, d4.getYYYY());
}
```

위 함수는 독자적인 세 가지의 개념을 분리하여 작성함이 맞다.

- 한 함수에 몰아넣어 **독자가 각 절이 거기에 존재하는 이유와 각 절이 테스트하는 개념을 모두 이해해야 한다.**

이 경우 `assert` 문이 여럿이라는 사실이 문제가 아니라, 한 테스트 함수에서 여러 개념을 테스트한다는 사실이 문제다.

<br/>

## F.I.R.S.T

---

깨끗한 테스트의 다섯 가지 규칙이다.

- **빠르게(Fast)**

  - 테스트가 느리면 자주 돌릴 엄두를 못 내며, 자주 돌리지 않으면 초반에 문제를 찾아내 고치지 못하기에 빨라야 한다.
  - 그렇지 않으면 코드를 마음껏 정리하지도 못하고, 결국 코드 품질이 망가지기 시작한다.

- **독립적으로(Independent)**

  - 한 테스트가 다음 테스트가 실행될 환경을 준비해서는 안 되기에, 독립적이어야 한다.
  - 순서가 상관 없어야 하며, 연이어서 발생하는 오류 때문에 후반 테스트가 찾아낼 결함을 못찾게된다.

- **반복 가능하게(Repeatable)**

  - 실제 환경, QA 환경, 버스를 타고 집으로 가는 길에 사용하는 노트북 환경(네트워크가 연결되지 않은)에서도 실행할 수 있어야 한다.
  - 테스트가 돌아가지 않는 환경이 하나라도 있다면 테스트가 실패한 이유를 둘러댈 변명이 생긴다.
  - 게다가 환경이 지원되지 않기에 테스트를 수행하지 못하는 상황에 직면한다.

- **자가검증하는(Self-Validating)**

  - 테스트는 `bool` 값으로 결과를 내야 한다.
  - 통과 여부를 알리고 로그 파일을 읽게 만들어서는 안 되며, 통과 여부를 보려고 텍스트 파일 두 개를 수작업으로 비교하게 만들어서도 안 된다.
  - 테스트가 스스로 성공과 실패를 가늠하지 않는다면 판단은 주관적이 되며 지루한 수작업 평가가 필요하게 된다.

- **적시에(Timely)**
  - 단위 테스트는 테스트하려는 실제 코드를 구현하기 직전에 구현한다.
  - 실제 코드를 구현한 다음에 테스트 코드를 만들면 실제 코드가 테스트하기 어렵다는 사실을 발견할지도 모른다.
  - 어떤 실제 코드는 테스트하기 너무 어렵다고 판명날지 모르고, 테스트가 불가능하도록 실제 코드를 설계할지도 모른다.

<br/>

## 결론

---

> 테스트 코드가 방치되어 망가지면 실제 코드도 망가진다. 테스트 코드를 깨끗하게 유지하자.
