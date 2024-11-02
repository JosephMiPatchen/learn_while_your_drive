import os
import argparse

def combine_files(input_dir, output_file):
    # Hardcoded set of directories to ignore
    ignore_dirs = {'.git', '.redwood', '.vscode', "dist"}

    with open(output_file, 'w') as outfile:
        for root, dirs, files in os.walk(input_dir):
            # Filter out the directories to skip
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                file_path = os.path.join(root, file)
                # Skip hidden files
                if not file.startswith('.') and os.path.isfile(file_path):
                    try:
                        with open(file_path, 'r') as infile:
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
