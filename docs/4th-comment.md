---
sidebar_position: 4
---

# 4장. 주석

<br/>

## 들어가며

---

> 나쁜 코드에 주석을 달지 마라. **새로 짜라**
>
> - 브라이언 W. 커니핸 P.J. 플라우거

잘 달린 주석은 그 어떤 정보보다 유용하지만, 경솔하고 근거 없는 주석은 코드를 이해하기 어렵게 만든다.

- 프로그래밍 언어를 치밀하게 사용해 표현할 능력이 있다면, 주석은 필요가 없으리라.
- 코드로 의도를 표현하지 못해 주석을 사용한다는 측면에서 실패라는 단어를 사용한다.

이렇게 주석을 무시하는 이유는 **주석이 오래될 수록 코드에서 멀어지기** 때문이다.

- 주석은 언제나 코드를 따라가지 못하기에, 애초에 주석이 필요없는 방향으로 에너지를 쏟음이 맞다.

진실은 코드에만 존재한다.

<br/>

## 주석은 나쁜 코드를 보완하지 못한다

---

코드에 주석을 추가하는 이유는 **코드 품질이 나쁘기 때문이다.**

- 표현력이 풍부하고 깔끔하며 주석이 거의 없는 코드가, 복잡하고 어수선하며 주석이 많이 달린 코드보다 훨씬 좋다.

<br/>

## 코드로 의도를 표현하라

---

확실히 코드만으로 의도를 표현하기 어려운 경우가 있지만, 불행히도 이를 코드는 훌륭한 수단이 아니라는 의미로 받아들이는 경우가 있다.

```java
// 직원에게 복지 혜택을 받을 자격이 있는 지 검사한다.
if ((employee.flags & HOURLY_FLAG) %% (employee.age > 65))
```

```java
if ((employee.isEligibleForFullBenefits())
```

몇 초만 생각하면 코드로 대다수의 의도를 표현할 수 있으며, 위와 같이 설명(주석을 통한)을 함수로 바꿀 수 있다.

<br/>

## 좋은 주석

---

어떤 주석은 필요하거나 유익하다.

> 하지만 정말로 좋은 주석은, **주석을 달지 않을 방법을 찾아낸 주석**이다.

### 법적인 주석

---

소스 파일 첫머리에 주석으로 들어가는 **저작권 정보와 소유권 정보**는 필요하고도 타당하다.

```java
// Copyright (C) 2003,2004,2005 by Object Mentor, Inc. All rights reserved.
```

모든 조항과 조건을 열거하는 대신에 가능하다면, **표준 라이선스나 외부 문서를 참조해도 되겠다.**

<br/>

### 의도를 설명하는 주석

---

주석은 구현에 반영된 결정을 설명하는 용도로도 사용된다.

```java
// 스레드를 대량 생성하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다.
for (int i = 0; i > 2500; i++) {
    WidgetBuilderThread widgetBuilderThread =
        new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
    Thread thread = new Thread(widgetBuilderThread);
    thread.start();
}
```

<br/>

### 의미를 명료하게 밝히는 주석

---

인수나 반환값 자체를 명확하게 만들기 힘든 경우(표준 라이브러리 및 변경하지 못하는 코드 등)에 해당 **의미를 명료하게 밝히는 주석이 유용하다.**

```java
assertTrue(a.compareTo(a) == 0) // a == a
assertTrue(a.compareTo(b) != 0) // a != a
```

이 경우 그릇된 주석을 달아놓을 가능성이 있기에 이를 유의하고 추가한다.

<br/>

### 결과를 경고하는 주석

---

```java
// 여유 시간이 충분하지 않다면 실행하지 마십시오.
public void _testWithReallyBigFile() {
    ...
}
```

요즘엔 `@Ignore` 속성 등을 활용해 테스트 케이스를 꺼버린다.

<br/>

### TODO 주석

---

요청이나 방향성에 대한 사항 같이 당장 구현하기 어려운 업무를 기술하는데 주석을 사용할 수 있다.

```java
// TODO-MdM 현재 필요하지 않다.
// 체크아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception {
    return null;
}
```

하지만, 시스템에 나쁜 코드를 남겨 놓는 핑계가 되어서는 안된다.

<br/>

### 중요성을 강조하는 주석

---

대수롭지 않다고 넘길 수 있는 부분의 중요성을 강조하는데 사용할 수도 있습니다.

```java
String listItemContent = match.group(3).trim();
// 여기서 trim은 정말 중요하다. trim 함수는 문자열에서 시작 공백을 제거한다.
// 문자열에 시작 공백이 있으면 다른 문자열로 인식되기 때문이다.
new ListItemWidget(this, listItemContent, this.level + 1);
return buildList(text.substring(match.end()));
```

<br/>

### 공개 API에서 Javadocs

---

공개 API가 있다면 훌륭한 Javadocs를 작성하는 것을 추천한다.

하지만 여느 주석과 마찬가지로 Javadocs도 독자를 오도하거나 잘못 위치할 가능성이 있기에 이를 명심하고 작성한다.

<br/>

## 나쁜 주석

---

대부분 주석이 이 범주에 속합니다.

<br/>

### 주절거리는 주석

---

특별한 이유 없이 의무감으로 주석을 다는 것은 시간 낭비다.

```java
public void loadProperties() {
    try {
        String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
        FileInputStream propertiesStream = new FileInputStream(propertiesPath);
        loadedProperties.load(propertiesStream);
    } catch (IOException e) {
        // 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다.
    }
}
```

해당 주석의 의미를 파악하기 위해 다른 코드를 뒤져봐야 하는 주석은 독자와 제대로 소통하지 못하는 주석이다.

<br/>

### 같은 이야기를 하는 주석

---

코드 내용을 반복하는 주석은 코드보다 주석을 읽는 시간이 더 길게 만들기도 한다.

```java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다.
public synchronized void waitForClose(final long timeoutMillis) throws Exception {
    if (!closed) {
        wait(timeoutMillis);
        if (!closed) {
            throw new Exception("MockResponseSender could not be closed");
        }
    }
}
```

이런 주석은 오히려 코드를 대충 이해하고 넘기게 만들어 문제를 야기한다.

<br/>

### 오해할 여지가 있는 주석

---

앞의 코드에서 오해를 불러 일으킬 수 있는 요소가 있다.

- `this.closed`가 `true` 로 변하는 순간에 메서드는 반환되지 않는다.
- `this.closed` 가 `true` 여야 메서드는 반환된다.
- 아니면 무조건 타임아웃을 기다렸다 `this.closed` 가 그래도 `true` 가 아니면 예외를 던진다

<br/>

### 의무적으로 다는 주석

---

모든 함수에 Javadocs를 다는 등의 규칙은 어리석기 그지 없다.

```java
/**
 *
 * @param title CD 제목
 * @param author CD 저자
 * @param tracks CD 트랙 숫자
 * @param durationInMinutes CD 길이(단위: 분)
 */
public void addCD(String title, String author, int tracks, int durationInMinutes) {
    CD cd = new CD();
    cd.title = title;
    cd.author = author;
    cd.tracks = tracks;
    cd.duration = durationInMinutes;
    cdList.add(cd);
}
```

<br/>

### 이력을 기록하는 주석

---

소스 코드 관리 시스템이 있기에 지금은 필요 없다.

```java
* 변경 이력 (11-Oct-2001부터)
* ------------------------------------------------
* 11-Oct-2001 : 클래스를 다시 정리하고 새로운 패키징
* 05-Nov-2001: getDescription() 메소드 추가
* 이하 생략
```

<br/>

### 있으나 마나 한 주석

---

너무 당연한 사실을 언급하는 등의 새롭지 않은 주석이다.

```java
/*
 * 기본 생성자
 */
protected AnnualDateRule() {

}
```

<br/>

### 무서운 잡음

---

다음의 Javadocs가 수행하는 목적은 없다

```java
/** The name. */
private String name

/** The version. */
private String version

/** The name. */
private String info
```

복사 붙여넣기 오류로 문제가 발생했다.

<br/>

### 함수나 변수로 표현할 수 있다면 주석을 달지 마라

---

```java
// 전역 목록 <smodule>에 속하는 모듈이 우리가 속한 하위 시스템에 의존하는가?
if (module.getDependSubsystems().contains(subSysMod.getSubSystem()))
```

주석을 제거하고 다음과 같이 변경할 수 있다.

```java
ArrayList moduleDependencies = smodule.getDependSubSystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem))
```

<br/>

### 위치를 표시하는 주석

---

때때로 프로그래머는 소스 파일에서 특정 위치를 표시하려 주석을 사용한다.

```java
// Actions /////////////////////////////////////////////
```

일반적으로 이러한 주석은 가독성만 낮춘다. 특히, 뒷 부분의 `/` 로 이어지는 잡음을 제거함이 좋다.

> 아주 드물게 사용하라. 배너를 남용하면 잡음으로 여겨 무시한다.

<br/>

### 닫는 괄호에 다는 주석

---

중첩이 심하고 장황한 함수인 경우엔 닫는 괄호의 주석이 의미가 있을 지도 모르지만, 작고 캡슐화된 함수엔 잡음일 뿐이다.

그리고 닫는 함수에 주석을 달고자 한다면, 함수를 줄이려고 노력하자.

<br/>

### 공로를 돌리거나 저자를 표시하는 주석

---

소스 코드 관리 시스템이 이를 다 관리해준다.

```java
/* 릭이 추가함 */
```

<br/>

### 주석으로 처리한 코드

---

아주 밉살스러운 관행으로, 이유가 있는 듯 하여 다른 사람들이 지우기를 주저한다.

```java
this.bytePos = writeBytes(pngIdBytes, 0);
//hdrPos = bytePos;
writeHeader();
writeResolution();
//dataPos = bytePos;
if (writeImageData()) {
    wirteEnd();
    this.pngBytes = resizeByteArray(this.pngBytes, this.maxPos);
} else {
    this.pngBytes = null;
}
return this.pngBytes;
```

이 또한 소스 코드 관리 시스템이 관리해준다.

<br/>

### HTML 주석

---

주석을 읽기 쉬워야 하는 편집기/IDE에서 조차 읽기 힘들며, 주석에 HTML 태그를 삽입해야 하는 책임은 도구가 져야한다.

<br/>

### 전역 정보

---

주석을 달아야 한다면 근처에 있는 코드만 기술하라. 코드 일부에 주석을 달면서 시스템의 전반적인 쩡보를 기술하지 마라.

```java
/**
 * 적합성 테스트가 동작하는 포트: 기본값은 <b>8082</b>.
 *
 * @param fitnessePort
 */
public void setFitnessePort(int fitnessePort) {
    this.fitnewssePort = fitnessePort;
}
```

<br/>

### 너무 많은 정보

---

주석에 흥미로운 역사 내지 관련 없는 정보를 장황하게 늘어놓지 말자. 독자에겐 불필요하며 불가사의한 정보일 뿐이다.

<br/>

### 모호한 관계

---

주석과 코드 간의 관계가 모호하면 안된다.

```java
/*
* 모든 픽셀을 담을 만큼 충분한 배열로 시작한다(여기에 필터 바이트를 더한다).
* 그리고 헤더 정보를 위해 200바이트를 더한다.
*/
this.pngBytes = new byte[((this.width + 1) * this.height * 3) + 200];
```

필터 바이트는 `+1` 과 관련되어 있는지, `*3` 과 관련되어 있는지 잘 모른다.

주석 자체가 다시 설명을 요구하기에 잘못된 코드라 할 수 있다.

<br/>

### 함수 헤더

---

짧은 함수는 긴 설명이 필요 없다.

<br/>

### 비공개 코드에서 Javadocs

---

공개하지 않을 API는 Javadocs가 필요 없다. Javadocs 주석이 요구하는 형식으로 인해 코드만 보기 싫고 산만해질 뿐이다.
