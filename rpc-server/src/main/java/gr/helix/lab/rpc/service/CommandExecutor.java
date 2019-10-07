package gr.helix.lab.rpc.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;

/**
 * Utility class for executing shell commands.
 */
public class CommandExecutor {

    /**
     * The command to execute.
     */
    private final String command;

    /**
     * Environment parameters to set during the command execution.
     */
    private String[] environmentParams = {};

    /**
     * Working directory of the process that executes the shell command.
     */
    private File workingDirectory = null;

    /**
     * Command execution timeout in milliseconds.
     */
    private long timeout = 0;

    /**
     * Timeout polling interval in milliseconds.
     */
    private final long checkInterval = 2000;

    /**
     * Simple {@link TaskExecutor} for executing threads.
     */
    private final TaskExecutor taskExecutor = new SimpleAsyncTaskExecutor();

    /**
     * True if the thread executing the task should be interrupted when timeout
     * expires.
     */
    private final boolean interruptOnCancel = false;

    /**
     * The process that executes the command.
     */
    private Process process;

    /**
     * Stores shell output. The caller may parse the output to decide if script
     * has been executed successfully.
     */
    private final List<String> output = new ArrayList<String>();

    /**
     * Creates a new {@link CommandExecutor}.
     *
     * @param command the command to execute.
     * @param timeout execution timeout in milliseconds.
     */
    public CommandExecutor(String command, long timeout) {
        this.command = command;
        this.timeout = timeout;
    }

    /**
     * Creates a new {@link CommandExecutor}.
     *
     * @param command the command to execute.
     * @param timeout execution timeout in milliseconds.
     * @param workingDirectory the working directory.
     */
    public CommandExecutor(String command, long timeout, String workingDirectory) {
        this.command = command;
        this.timeout = timeout;
        this.workingDirectory = new File(workingDirectory);
    }

    /**
     * Creates a new {@link CommandExecutor}.
     *
     * @param command the command to execute.
     * @param timeout execution timeout in milliseconds.
     * @param workingDirectory the working directory.
     * @param environmentParams the environment variables to set.
     */
    public CommandExecutor(String command, long timeout, String workingDirectory, String[] environmentParams) {
        this.command = command;
        this.timeout = timeout;
        this.workingDirectory = new File(workingDirectory);
        this.environmentParams = environmentParams;
    }

    /**
     * Executes the command.
     *
     * @return the exit status of the command execution.
     * @throws Exception if command fails.
     */
    public Integer execute() throws Exception {
        final FutureTask<Integer> systemCommandTask = new FutureTask<Integer>(new Callable<Integer>() {

            @Override
            public Integer call() throws Exception {
                CommandExecutor.this.process = Runtime.getRuntime().exec(CommandExecutor.this.command, CommandExecutor.this.environmentParams, CommandExecutor.this.workingDirectory);
                return CommandExecutor.this.process.waitFor();
            }

        });

        final long startTime = System.currentTimeMillis();

        this.taskExecutor.execute(systemCommandTask);

        while (true) {
            Thread.sleep(this.checkInterval);

            if (systemCommandTask.isDone()) {
                this.readOutput();

                return systemCommandTask.get();
            } else if (System.currentTimeMillis() - startTime > this.timeout) {
                systemCommandTask.cancel(this.interruptOnCancel);
                throw new Exception("Execution of system command did not finish within the timeout.");
            }
        }
    }

    public String getCommand() {
        return this.command;
    }

    public String[] getEnvironmentParams() {
        return this.environmentParams;
    }

    public File getWorkingDirectory() {
        return this.workingDirectory;
    }

    public long getTimeout() {
        return this.timeout;
    }

    public String[] getOutput() {
        return this.output.toArray(new String[] {});
    }

    /**
     * Reads the shell command output.
     *
     * @throws Exception if an I/O error occurs.
     */
    private void readOutput() throws Exception {
        this.output.clear();

        final BufferedReader reader = new BufferedReader(new InputStreamReader(this.process.getInputStream()));

        String line = "";
        while ((line = reader.readLine()) != null) {
            this.output.add(line);
        }
    }

}