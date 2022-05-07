---
sidebar_position: 5
---

# 5장. 형식 맞추기

<br/>

## 들어가며

---

코드를 봤을 때 독자들이 코드가 깔끔하고, 일관적이며, 꼼꼼하다고 감탄하면 좋겠다.

프로그래머라면 형식을 깔끔하게 맞춰 코드를 짜야 한다.

- 이를 위해 **간단한 규칙**을 정하고, 팀으로 일한다면 합의 하에 그 규칙을 전체가 따라야한다.
- 필요하다면 **규칙을 적용해주는 도구**를 사용한다.

<br/>

## 형식을 맞추는 목적

---

코드 형식은 **의사소통의 일환**이며, 의사소통은 전문 개발자의 일차적인 의무다.

- 기능 구현을 일차적인 목표로 볼 수도 있다.
  - 그러나 오늘 구현한 기능이 다음 버전에서 바뀔 확률을 높지만, 오늘 구현한 코드의 가독성은 **바뀔 코드의 품질**에 지대한 영향을 끼친다.
- 또한, 기존 코드는 사라지더라도 **개발자의 스타일과 규율**은 사라지지 않는다.

<br/>

## 적절한 행 길이를 유지하라

---

일반적으로 큰 파일보다 **작은 파일이 이해하기 쉽다.**

> 책의 그림 5.1에서 500줄을 넘기지 않고 대부분 200줄 정도인 파일로도 커다란 시스템을 구현할 수 있다는 것을 증명한다.

<br/>

### 신문 기사처럼 작성하라

---

대부분 독자는 신문 기사의 최상단 표제를 통해 기사를 읽을지 결정하고, 아래로 내려갈 수록 세세한 내용이 나온다.

- 소스 파일도 이와 비슷하게 작성하며, 모듈 이름을 **간단하면서도 설명이 가능하게 짓는다.**
  - 이름만 보고도 올바른 모듈을 살펴보는 지에 대해 알기 위해
- 소스 파일 첫 부분은 고차원 개념과 알고리즘을 설명한다.
  - 마지막으로 갈 수록 저차원 함수와 세부 내용이 나온다.

<br/>

### 개념은 빈 행으로 분리하라

---

각 행은 **수식이나 절**을 나타내고, 일련의 행 묶음은 **완결된 생각 하나**를 표현한다.

그렇기에 생각 사이엔 **빈 행**으로 분리해야 마땅하다.

```java
// 빈 행을 넣지 않을 경우
package fitnesse.wikitext.widgets;
import java.util.regex.*;
public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL);
	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text); match.find();
		addChildWidgets(match.group(1));}
	public String render() throws Exception {
		StringBuffer html = new StringBuffer("<b>");
		html.append(childHtml()).append("</b>");
		return html.toString();
	}
}
```

```java
// 빈 행을 넣을 경우
package fitnesse.wikitext.widgets;

import java.util.regex.*;

public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL
	);

	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text);
		match.find();
		addChildWidgets(match.group(1));
	}

	public String render() throws Exception {
		StringBuffer html = new StringBuffer("<b>");
		html.append(childHtml()).append("</b>");
		return html.toString();
	}
}
```

두 가지 소스 코드는 빈 행의 유무만 다를 뿐인데, 전자는 행 묶음이 분리되어 보이고 후자는 전체가 한 덩어리로 보인다.

이처럼 빈 행은 가독성에 큰 영향을 끼친다.

<br/>

### 세로 밀집도

---

세로 밀집도는 **연관성**을 의미한다.

즉, 서로 밀접한 코드 행은 세로로 가까이 놓여야 한다는 뜻이다.

```java
// 의미없는 주석으로 변수를 떨어뜨려 놓아서 한눈에 파악이 잘 안된다.

public class ReporterConfig {
	/**
	* The class name of the reporter listener
	*/
	private String m_className;

	/**
	* The properties of the reporter listener
	*/
	private List<Property> m_properties = new ArrayList<Property>();
	public void addProperty(Property property) {
		m_properties.add(property);
	}
}
```

```java
// 의미 없는 주석을 제거함으로써 코드가 한눈에 들어온다.
// 변수 2개에 메소드가 1개인 클래스라는 사실이 드러난다.

public class ReporterConfig {
	private String m_className;
	private List<Property> m_properties = new ArrayList<Property>();

	public void addProperty(Property property) {
		m_properties.add(property);
	}
}
```

<br/>

### 수직 거리

---

서로 밀접한 개념은 **세로**로 가까이 두어야 한다.

같은 파일에 속할 정도로 밀접한 두 개념은 세로 거리로 **연관성**을 표현하며, 연관성이란 한 개념을 이해하는데 다른 개념이 중요한 정도를 의미한다.

<br/>

#### 변수 선언

---

**사용하는 위치에 최대한 가까이 선언**한다.

지역 변수는 **각 함수 맨 처음에 선언**한다.

```java
// InputStream이 함수 맨 처음에 선언 되어있다.
private static void readPreferences() {
    InputStream is = null;
    try {
        is = new FileInputStream(getPreferencesFile());
        setPreferences(new Properties(getPreferences()));
        getPreferences().load(is);
    } catch (IOException e) {
            try {
                if (is != null)
                    is.close();
            } catch (IOException e1) {
        }
    }
}
```

루프를 제어하는 변수는 흔히 **루프 문 내부**에 선언한다.

```java
// 모두들 알다시피 루프 제어 변수는 Test each처럼 루프 문 내부에 선언
public int countTestCases() {
    int count = 0;
    for (Test each : tests)
    count += each.countTestCases();
    return count;
}
```

- 루프 직전에 변수를 선언하는 사례도 있다.

```java
for (XmlTest test : m_suite.getTests()) {
    TestRunner tr = m_runnerFactory.newTestRunner(this, test);
    tr.addListener(m_textReporter);
    m_testRunners.add(tr);

    invoker = tr.getInvoker();

    for (ITestNGMethod m : tr.getBeforeSuiteMethods()) {
        beforeSuiteMethods.put(m.getMethod(), m);
    }

    for (ITestNGMethod m : tr.getAfterSuiteMethods()) {
        afterSuiteMethods.put(m.getMethod(), m);
    }
}
```

<br/>

#### 인스턴스 변수

---

**클래스 맨 처음**에 선언하며, 변수 간 세로 거리를 두지 않는다.

- 잘 설계한 클래스는 **대다수 클래스 메서드가 인스턴스 변수를 사용하기 때문**이다.

인스턴스 선언 위치에 대한 의견은 분분하지만 중요한 점은 **잘 알려진 위치에 인스턴스 변수를 모은다는 사실**이다.

```java
// 도중에 선언된 변수는 꽁꽁 숨겨놓은 보물 찾기와 같다. 십중 팔구 코드를 읽다가 우연히 발견한다. 발견해보시길.
// 요즘은 IDE가 잘 되어있어서 찾기야 어렵지 않겠지만, 더러운건 마찬가지

public class TestSuite implements Test {
	static public Test createTest(Class<? extends TestCase> theClass,
									String name) {
		...
	}

	public static Constructor<? extends TestCase>
	getTestConstructor(Class<? extends TestCase> theClass)
	throws NoSuchMethodException {
		...
	}

	public static Test warning(final String message) {
		...
	}

	private static String exceptionToString(Throwable t) {
		...
	}

	private String fName;

	private Vector<Test> fTests= new Vector<Test>(10);

	public TestSuite() { }

	public TestSuite(final Class<? extends TestCase> theClass) {
		...
	}

	public TestSuite(Class<? extends TestCase> theClass, String name) {
		...
	}

	... ... ... ... ...
}
```

위 코드의 경우 코드를 읽다 중간 중간에 선언된 인스턴스 변수를 발견하게 된다.

<br/>

#### 종속 함수

---

한 함수가 다른 함수를 호출한다면 **세로로 가까이 배치**하며, 되도록 호출하는 함수를 호출되는 함수보다 먼저 배치한다.

- 규칙이 일관적으로 적용된다면 독자는 **호출된 함수가 잠시 후에 정의될 것이라는 것**을 예측한다.

```java
/*첫째 함수에서 가장 먼저 호출하는 함수가 바로 아래 정의된다.
다음으로 호출하는 함수는 그 아래에 정의된다. 그러므로 호출되는 함수를 찾기가 쉬워지며
전체 가독성도 높아진다.*/

/*makeResponse 함수에서 호출하는 getPageNameOrDefault함수 안에서 "FrontPage" 상수를 사용하지 않고,
상수를 알아야 의미 전달이 쉬워지는 함수 위치에서 실제 사용하는 함수로 상수를 넘겨주는 방법이
가독성 관점에서 훨씬 더 좋다*/

public class WikiPageResponder implements SecureResponder {
	protected WikiPage page;
	protected PageData pageData;
	protected String pageTitle;
	protected Request request;
	protected PageCrawler crawler;

	public Response makeResponse(FitNesseContext context, Request request) throws Exception {
		String pageName = getPageNameOrDefault(request, "FrontPage");
		loadPage(pageName, context);
		if (page == null)
			return notFoundResponse(context, request);
		else
			return makePageResponse(context);
		}

	private String getPageNameOrDefault(Request request, String defaultPageName) {
		String pageName = request.getResource();
		if (StringUtil.isBlank(pageName))
			pageName = defaultPageName;

		return pageName;
	}

	protected void loadPage(String resource, FitNesseContext context)
		throws Exception {
		WikiPagePath path = PathParser.parse(resource);
		crawler = context.root.getPageCrawler();
		crawler.setDeadEndStrategy(new VirtualEnabledPageCrawler());
		page = crawler.getPage(context.root, path);
		if (page != null)
			pageData = page.getData();
	}

	private Response notFoundResponse(FitNesseContext context, Request request)
		throws Exception {
		return new NotFoundResponder().makeResponse(context, request);
	}

	private SimpleResponse makePageResponse(FitNesseContext context)
		throws Exception {
		pageTitle = PathParser.render(crawler.getFullPath(page));
		String html = makeHtml(context);
		SimpleResponse response = new SimpleResponse();
		response.setMaxAge(0);
		response.setContent(html);
		return response;
	}
...
```

<br/>

#### 개념적 유사성

---

개념적 친화도가 높을수록 코드를 가까이에 배치한다.

친화도가 높은 요인은 다음과 같은 경우들이 있다.

- 한 함수가 다른 함수를 호출하는 종속성
- 변수와 그 변수를 사용하는 함수
- 비슷한 동작을 하는 일군의 함수

```java
// 같은 assert 관련된 동작들을 수행하며, 명명법이 똑같고 기본 기능이 유사한 함수들로써 개념적 친화도가 높다.
// 이런 경우에는 종속성은 오히려 부차적 요인이므로, 종속적인 관계가 없더라도 가까이 배치하면 좋다.

public class Assert {
	static public void assertTrue(String message, boolean condition) {
		if (!condition)
			fail(message);
	}

	static public void assertTrue(boolean condition) {
		assertTrue(null, condition);
	}

	static public void assertFalse(String message, boolean condition) {
		assertTrue(message, !condition);
	}

	static public void assertFalse(boolean condition) {
		assertFalse(null, condition);
	}
...
```

위 함수들은 명명법이 똑같고 기본 기능이 유사하며 간단하다.

<br/>

### 세로 순서

---

일반적으로 함수 호출 종속성은 **아래 방향**으로 유지한다.

- 즉, 호출되는 함수를 호출하는 함수보다 나중에 배치한다.
  - 그러면 소스 코드 모듈이 고차원에서 저차원으로 자연스럽게 내려간다.
- 가장 중요한 개념을 먼저 설명하며 이때 세세한 사항을 최대한 배제한다.

그러면 독자가 소스 파일에서 첫 함수 몇 개만 읽어도 개념을 파악하기 쉬워진다.

<br/>

## 가로 형식 맞추기

---

프로그래머는 명백히 **짧은 행을 선호한다.**

> 저자 개인적으론 **행 당 120자 미만**을 권장한다.

<br/>

### 가로 공백과 밀집도

---

가로 공백을 통해 밀접한 개념과 느슨한 개념을 표현한다.

```java
private void measureLine(String line) {
	lineCount++;

	// 흔히 볼 수 있는 코드인데, 할당 연산자 좌우로 공백을 주어 왼쪽,오른쪽 요소가 확실하게 구분된다.
	int lineSize = line.length();
	totalChars += lineSize;

	// 반면 함수 이름과 괄호 사이에는 공백을 없앰으로써 함수와 인수의 밀접함을 보여준다
	// 괄호 안의 인수끼리는 쉼표 뒤의 공백을 통해 인수가 별개라는 사실을 보여준다.
	lineWidthHistogram.addLine(lineSize, lineCount);
	recordWidestLine(lineSize);
}
```

```java
// 승수 사이엔 공백이 없으며, 항 사이에는 공백이 들어간다.
return b*b - 4*a*c;
```

<br/>

### 가로 정렬

---

```java
public class FitNesseExpediter implements ResponseSender {
	private		Socket		  socket;
	private 	InputStream 	  input;
	private 	OutputStream 	  output;
	private 	Reques		  request;
	private 	Response 	  response;
	private 	FitNesseContex	  context;
	protected 	long		  requestParsingTimeLimit;
	private 	long		  requestProgress;
	private 	long		  requestParsingDeadline;
	private 	boolean		  hasError;

	...
```

위 경우 코드가 엉뚱한 부분을 강조해 변수 유형은 무시하고 변수 이름부터 읽게 되고, 대부분의 코드 포맷터가 위와 같은 정렬을 무시한다.

정렬이 필요할 정도로 목록이 길다면 문제는 **목록 길이**지 정렬 부족이 아니다.

- 선언부가 길다는 것은 클래스를 쪼개야 한다는 것을 의미한다.

<br/>

### 들여쓰기

---

우리는 범위(scope)로 이루어진 계층을 표현하기 위해 **코드를 들여쓴다.**

- 프로그래머는 이런 들여쓰기 형식에 크게 의존하며, 범위를 이동하는 것이 유용해진다.
- 들여쓰기한 파일은 구조가 한 눈에 들어온다.

<br/>

#### 들여쓰기 무시하기

---

한 행에 범위를 뭉뚱그린 코드를 피하자.

```java
// 이렇게 한행에 다 넣을 수 있다고 다 때려 박는 것이 멋있는 코드가 아니란 것! 알아두삼

public class CommentWidget extends TextWidget {
	public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";

	public CommentWidget(ParentWidget parent, String text){super(parent, text);}
	public String render() throws Exception {return ""; }
}

---

// 한줄이라도 정성스럽게 들여쓰기로 감싸주자. 가독성을 위해

public class CommentWidget extends TextWidget {
	public static final String REGEXP = "^#[^\r\n]*(?:(?:\r\n)|\n|\r)?";

	public CommentWidget(ParentWidget parent, String text){
		super(parent, text);
	}

	public String render() throws Exception {
		return "";
	}
}
```

<br/>

### 가짜 범위

---

빈 `while` 문이나 `for` 문을 되도록 피해야 한다.

그러나 그럴 수 없는 경우 **빈 블록을 올바르게 들여쓰고 괄호로 감싼다.**

<br/>

## 팀 규칙

---

팀에 속한다면 자신이 선호해야 할 것은 **팀 규칙이다.**

팀은 한 가지 규칙에 합의하고 이를 따라야 한다. 그래야 소프트웨어가 **일관적인 스타일**을 보인다.

- 좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄진다는 사실을 기억하자.

<br/>

## 밥 아저씨의 형식 규칙

---

```java
public class CodeAnalyzer implements JavaFileAnalysis {
	private int lineCount;
	private int maxLineWidth;
	private int widestLineNumber;
	private LineWidthHistogram lineWidthHistogram;
	private int totalChars;

	public CodeAnalyzer() {
		lineWidthHistogram = new LineWidthHistogram();
	}

	public static List<File> findJavaFiles(File parentDirectory) {
		List<File> files = new ArrayList<File>();
		findJavaFiles(parentDirectory, files);
		return files;
	}

	private static void findJavaFiles(File parentDirectory, List<File> files) {
		for (File file : parentDirectory.listFiles()) {
			if (file.getName().endsWith(".java"))
				files.add(file);
			else if (file.isDirectory())
				findJavaFiles(file, files);
		}
	}

	public void analyzeFile(File javaFile) throws Exception {
		BufferedReader br = new BufferedReader(new FileReader(javaFile));
		String line;
		while ((line = br.readLine()) != null)
			measureLine(line);
	}

	private void measureLine(String line) {
		lineCount++;
		int lineSize = line.length();
		totalChars += lineSize;
		lineWidthHistogram.addLine(lineSize, lineCount);
		recordWidestLine(lineSize);
	}

	private void recordWidestLine(int lineSize) {
		if (lineSize > maxLineWidth) {
			maxLineWidth = lineSize;
			widestLineNumber = lineCount;
		}
	}

	public int getLineCount() {
		return lineCount;
	}

	public int getMaxLineWidth() {
		return maxLineWidth;
	}

	public int getWidestLineNumber() {
		return widestLineNumber;
	}

	public LineWidthHistogram getLineWidthHistogram() {
		return lineWidthHistogram;
	}

	public double getMeanLineWidth() {
		return (double)totalChars/lineCount;
	}

	public int getMedianLineWidth() {
		Integer[] sortedWidths = getSortedWidths();
		int cumulativeLineCount = 0;
		for (int width : sortedWidths) {
			cumulativeLineCount += lineCountForWidth(width);
			if (cumulativeLineCount > lineCount/2)
				return width;
		}
		throw new Error("Cannot get here");
	}

	private int lineCountForWidth(int width) {
		return lineWidthHistogram.getLinesforWidth(width).size();
	}

	private Integer[] getSortedWidths() {
		Set<Integer> widths = lineWidthHistogram.getWidths();
		Integer[] sortedWidths = (widths.toArray(new Integer[0]));
		Arrays.sort(sortedWidths);
		return sortedWidths;
	}
}
```
