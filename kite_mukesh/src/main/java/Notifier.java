import com.sun.codemodel.internal.JOp;
import sun.audio.AudioPlayer;
import sun.audio.AudioStream;

import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

class PlaySound {
    public void playSound(String filename) throws IOException {

//        InputStream in = new FileInputStream(filename);
//        AudioStream audioStream = new AudioStream(in);
//        AudioPlayer.player.start(audioStream);
    }

}
public class Notifier {

    private final ExecutorService executorService;

    public Notifier() {
        executorService = Executors.newFixedThreadPool(15);
    }
    ExecutorService t = Executors.newFixedThreadPool(10);
    JFrame frame = new JFrame ("Test");
    JTextArea textArea = new JTextArea ("Test");
    int alertCount = 0;

    public void notify(String message){

        JOptionPane.showMessageDialog(null, message);
//        if(true) return;
        t.execute(new Runnable() {
            @Override
            public void run() {
                String gongFile = "/Users/mbang/Downloads/beep2.wav";
                try {
                    new PlaySound().playSound(gongFile);
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        });

        long currentTs = System.currentTimeMillis();
        if ((currentTs > 1549434540000L && currentTs < 1549436400000L) || StockParse.pause)
            return;

        System.out.println("Adding alert msg "  + message);

        JScrollPane scroll = new JScrollPane (textArea,
                JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);

        frame.add(scroll);
        frame.setPreferredSize(new Dimension(400,300));
//        frame.setVisible (true);

        textArea.setText(textArea.getText() + "\n" + message);
//        frame.show();
        frame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                super.windowClosing(e);
                System.out.println("Window closing");
                if (alertCount > 15){
                    textArea.setText("");
                    alertCount = 0;
                }

            }
        });


    }
}
