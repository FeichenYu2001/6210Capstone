import language_tool_python

def grammar_check(resume_text):
    try:
        tool = language_tool_python.LanguageTool('en-US')
        matches = tool.check(resume_text)
        return len(matches), matches[:5]
    except Exception as e:
        return 0, [{"message": f"Grammar check failed: {e}"}]