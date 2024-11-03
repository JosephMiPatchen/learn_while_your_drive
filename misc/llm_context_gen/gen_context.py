import os
import argparse

def combine_files(input_dir, output_file):
    # Hardcoded sets of directories and filenames to ignore
    ignore_dirs = {'.git', '.redwood', '.vscode', 'dist', 'node_modules', '.yarn'}
    ignore_files = {'README.md', 'LICENSE', 'dev.db', 'favicon.png', 'yarn.lock'}

    with open(output_file, 'w') as outfile:
        for root, dirs, files in os.walk(input_dir):
            # Filter out the directories to skip
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            print(f"Processing directory: {root}")  # Debugging output for directory traversal

            for file in files:
                file_path = os.path.join(root, file)

                # Check only the base name of the file against ignore_files
                if not file.startswith('.') and os.path.basename(file) not in ignore_files and os.path.isfile(file_path):
                    try:
                        with open(file_path, 'r') as infile:
                            print(f"Including file: {file_path}")  # Debugging output for file inclusion
                            # Write filename as a header in the output file
                            outfile.write(f"\n\n--- {file_path} ---\n\n")
                            # Write content of the file
                            outfile.write(infile.read())
                    except Exception as e:
                        print(f"Warning: Could not read {file_path} - {e}")
                        continue  # Skip to the next file if there's an error

def main():
    parser = argparse.ArgumentParser(description="Combine all files in a directory into a single file for LLM context.")
    parser.add_argument('input_dir', type=str, help="The path to the input directory.")
    parser.add_argument('output_file', type=str, help="The path to the output file.")

    args = parser.parse_args()
    combine_files(args.input_dir, args.output_file)

if __name__ == "__main__":
    main()
