package test;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.knowm.xchart.QuickChart;
import org.knowm.xchart.SwingWrapper;
import org.knowm.xchart.XYChart;

import javax.swing.*;
import java.io.*;
import java.text.MessageFormat;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by mukesh.bang on 07/12/16.
 */
class Stock {
    Connection connection;
    String url;
    String seriesName;
    private int time;
    FileWriter fw;
    int x = 0;

    public Stock(String seriesName, int time) throws IOException {
        fw = new FileWriter(new File(seriesName + ".txt"), true);

        this.seriesName = seriesName;
        this.time = time;
        url = MessageFormat.format(StockParse.URL, seriesName);

        FileReader fr = new FileReader(new File("/tmp/1.txt"));
        BufferedReader br = new BufferedReader(fr);
        String line = br.readLine();

        System.out.println("Starting...");
        while(line.length() != 0){
            double val = Double.parseDouble(line);
            values.add(val);
            line = br.readLine();
//            System.out.println(val);
        }
        System.out.println("Done...");


    }

    public void start() throws InterruptedException {
        Thread t = new Thread(new Runnable() {
            public void run() {
                try {
                    stock();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
        System.out.println(seriesName + " -- Started...");
    }

    public void stock() {

        try {
            List xList = new LinkedList();
            List yList = new LinkedList();

            xList.add(0);
            double val = getBankValue();
            double lastVal = val;
            yList.add(val);

            // Create Chart
            final XYChart chart = QuickChart.getChart(seriesName, "Price", "Time", seriesName, xList, yList);


            // Show it
            final SwingWrapper<XYChart> sw = new SwingWrapper<XYChart>(chart);
            JFrame jFrame = sw.displayChart();

            jFrame.setDefaultCloseOperation(WindowConstants.HIDE_ON_CLOSE);
            boolean set = false;

            while (true) {
                try {
                    Thread.sleep(time);

                    val = getBankValue();
                    System.out.println(seriesName + "..." + val);

                    if (val == lastVal)
                        continue;

                    if (xList.size() > 400) {
                        xList.remove(0);
                        yList.remove(0);
                    }
                    xList.add(x++);
                    yList.add(val);

                    chart.updateXYSeries(seriesName, xList, yList, null);
                    sw.repaintChart();
                    if (!set) {
                        sw.getXChartPanel(0).setAutoscrolls(true);
                        sw.getXChartPanel().getAutoscrolls();
                        set = true;
                    }
                    lastVal = val;

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            System.out.println(seriesName + " -- Done...");

        }


    }


    int i = 0;
    List<Double> values = new LinkedList<>();

    public double getBankValue() throws IOException {
        if(i < values.size())
            return values.get(i++);
        else
            return values.get(values.size()-1);
    }

    private String tmp(String input) {
        return input.replaceAll(",", "");
    }

}


public class StockParse {


    //    static String URL = "https://secure.icicidirect.com/IDirectTrading/Trading/FNO/GetQuoteData.aspx?FFO_XCHNG_CD=NFO&FFO_PRDCT_TYP=F&FFO_UNDRLYNG={0}&FFO_EXPRY_DT=29-Jun-2017&FFO_EXER_TYP=E&FFO_OPT_TYP=";
    static String URL = "https://secure.icicidirect.com/IDirectTrading/Trading/FNO/GetQuoteData.aspx?FFO_XCHNG_CD=NFO&FFO_PRDCT_TYP=F&FFO_UNDRLYNG={0}&FFO_EXPRY_DT=27-Sep-2018&FFO_OPT_TYP=*&FFO_EXER_TYP=E";

    static FileWriter fw;

    public StockParse() throws IOException {
        fw = new FileWriter(new File("banks.txt"), true);

    }
    public static enum ReviewStatus {
        PENDING(2),
        COMPLETED(1),
        DECLINED(3),
        SCHEDULED(4);

        int i;
        private ReviewStatus(int i) {
            this.i = i;
        }
    }


    static class Key {
        String a;
        int b;

        public Key(String a, int b) {
            this.a = a;
            this.b = b;
        }

        @Override
        public String toString() {
            return "Key{" +
                    "!a='" + a + '\'' +
                    ", !b=" + b +
                    '}';
        }
    }
    public static void main(String[] args) throws IOException, InterruptedException {


        while (true) {
            InputStreamReader r = new InputStreamReader(System.in);
            BufferedReader br = new BufferedReader(r);
            System.out.println("Enter code: ");
            String code = br.readLine();
            System.out.println("Enter time: ");
            try {
                int time = Integer.parseInt(br.readLine());
                new Stock(code, time).start();
            } catch (Exception e) {
                System.out.println("INvalid input.. ");
            }


        }

    }

}
