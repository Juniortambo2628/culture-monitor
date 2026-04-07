import os
import re

def clean_classes(content):
    # Regex for font-black, uppercase, and tracking-* (NOT tight/tighter)
    # The [^\w-] ensures we don't match sub-words, or it's the end of the string
    
    # 1. Remove font-black
    content = re.sub(r'(?<=\s)font-black(?=\s|$)|(?<=")font-black(?=\s|")|(?<=\s)font-black(?=")', '', content)
    
    # 2. Remove uppercase
    content = re.sub(r'(?<=\s)uppercase(?=\s|$)|(?<=")uppercase(?=\s|")|(?<=\s)uppercase(?=")', '', content)
    
    # 3. Remove tracking-* except tracking-tight and tracking-tighter
    # We use a negative lookahead to exclude tight and tighter
    content = re.sub(r'\btracking-(?!(tight|tighter)\b)[a-z\[\]0-9.-]+\b', '', content)
    
    # 4. Cleanup double spaces and spaces near quotes in className attributes
    # Find all className="..." or className={`...`} etc.
    def cleanup_spacing(match):
        attr = match.group(0)
        # Remove extra spaces
        cleaned = re.sub(r'\s{2,}', ' ', attr)
        # Remove space after " or {`
        cleaned = re.sub(r'="\s+', '="', cleaned)
        cleaned = re.sub(r'={`\s+', '={`', cleaned)
        # Remove space before " or `}
        cleaned = re.sub(r'\s+"', '"', cleaned)
        cleaned = re.sub(r'\s+`}', '`}', cleaned)
        return cleaned

    content = re.sub(r'className=(("[^"]*")|( {`[^`]*`})|( {[^}]*}))', cleanup_spacing, content)
    
    return content

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = clean_classes(content)
                    
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Cleaned: {path}")
                except Exception as e:
                    print(f"Error processing {path}: {e}")

if __name__ == "__main__":
    process_directory("c:\\wamp64\\www\\culture-monitor-app\\frontend\\src")
