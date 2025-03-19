const testCases = [
  '{{< image src="test.jpg" alt="让完播率>50% (3/3)" >}}',
  '{{< shortcode param="value" >}}',
  '{{< code >}}function() { return x > y; }{{< /code >}}',
  '{{< image src="test.jpg" />}}',
  '{{< tabs tabTotal="5" tabID="2" tabName="second" >}}'
];

// 改进的正则表达式，使用两步法处理
// 先匹配基本的开头，然后在代码中处理引号内的内容
const shortcodeStartPattern = /{{<\s*(\/)?\s*([a-zA-Z0-9_.-]+)/g;

// 更智能的解析方法，处理引号中的特殊字符
function parseShortcode(input) {
  // 重置正则
  shortcodeStartPattern.lastIndex = 0;
  
  // 匹配开头部分
  const startMatch = shortcodeStartPattern.exec(input);
  if (!startMatch) return null;
  
  const isClosing = !!startMatch[1];
  const name = startMatch[2];
  let pos = shortcodeStartPattern.lastIndex;
  
  // 解析参数部分和结束部分
  let params = [];
  let isInline = false;
  let inQuote = false;
  let quoteChar = '';
  let currentParam = '';
  let found = false;
  
  while (pos < input.length) {
    const char = input[pos];
    const nextChar = pos + 1 < input.length ? input[pos + 1] : '';
    
    if (!inQuote) {
      // 检查是否遇到引号
      if (char === '"' || char === "'") {
        inQuote = true;
        quoteChar = char;
        currentParam += char;
      }
      // 检查是否遇到内联结束标记
      else if (char === '/' && nextChar === '>') {
        isInline = true;
        pos += 2;
        // 跳过剩余的 }}}
        while (pos < input.length && input[pos] !== '}') pos++;
        pos++;
        found = true;
        break;
      }
      // 检查是否遇到常规结束标记
      else if (char === '>' && nextChar === '}') {
        pos += 2;
        // 跳过剩余的 }
        while (pos < input.length && input[pos] !== '}') pos++;
        pos++;
        found = true;
        break;
      }
      // 空格表示参数之间的分隔
      else if (char === ' ' || char === '\t') {
        if (currentParam.trim()) {
          params.push(currentParam.trim());
          currentParam = '';
        }
      }
      else {
        currentParam += char;
      }
    }
    else {
      // 在引号内
      // 检查是否遇到匹配的结束引号
      if (char === quoteChar && input[pos - 1] !== '\\') {
        inQuote = false;
        currentParam += char;
        params.push(currentParam.trim());
        currentParam = '';
      }
      else {
        currentParam += char;
      }
    }
    
    pos++;
  }
  
  // 添加最后一个参数（如果有）
  if (currentParam.trim() && !isInline) {
    params.push(currentParam.trim());
  }
  
  if (!found) return null;
  
  return {
    original: input.substring(0, pos),
    name,
    isClosing,
    params,
    isInline
  };
}

testCases.forEach((testCase, index) => {
  console.log("===== Test Case " + (index + 1) + " =====");
  console.log("Input: " + testCase);
  
  const result = parseShortcode(testCase);
  if (result) {
    console.log("Result: Match found");
    console.log("Full match: " + result.original);
    console.log("Name: " + result.name);
    console.log("Closing: " + (result.isClosing ? "Yes" : "No"));
    console.log("Parameters: " + (result.params.length > 0 ? JSON.stringify(result.params) : "none"));
    console.log("Inline: " + (result.isInline ? "Yes" : "No"));
  } else {
    console.log("Result: No match found");
  }
  console.log("");
}); 