import os
import argparse

def generate_directory_structure(input_dir, ignore_dirs):
    """
    Generate a string representation of the directory structure, skipping ignored directories.
    """
    structure = []
    for root, dirs, files in os.walk(input_dir):
        # Filter out directories to skip
        dirs[:] = [d for d in dirs if d not in ignore_dirs]

        # Calculate the indentation level based on the directory depth
        level = root.replace(input_dir, '').count(os.sep)
        indent = ' ' * 4 * level  # Indent with 4 spaces per level
        structure.append(f"{indent}{os.path.basename(root)}/")

        for file in files:
            # Skip hidden files and files with .mp3 extension
            if not file.startswith('.') and not file.endswith('.mp3'):
                structure.append(f"{indent}    {file}")
    return "\n".join(structure)

def combine_files(input_dir, output_file):
    # Hardcoded sets of directories and filenames to ignore
    ignore_dirs = {'.git', '.redwood', '.vscode', 'dist', 'node_modules', '.yarn','data'}
    ignore_files = {'README.md', 'LICENSE', 'dev.db', 'favicon.png', 'yarn.lock'}

    with open(output_file, 'w') as outfile:
        # Write an introductory description of the project structure
        outfile.write("This file combines the directory structure and file contents of the project.\n")
        outfile.write("Below is the directory structure, followed by the contents of selected files.\n\n")

        # Generate and write the directory structure
        dir_structure = generate_directory_structure(input_dir, ignore_dirs)
        outfile.write("Project Directory Structure:\n")
        outfile.write(dir_structure)
        outfile.write("\n\n--- File Contents Below ---\n\n")

        # Traverse the input directory to write file contents
        for root, dirs, files in os.walk(input_dir):
            # Filter out the directories to skip
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                file_path = os.path.join(root, file)

                # Skip hidden files, .mp3 files, and files listed in ignore_files
                if not file.startswith('.') and not file.endswith('.mp3') and not file.endswith('.sql') and os.path.basename(file) not in ignore_files and os.path.isfile(file_path):
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
