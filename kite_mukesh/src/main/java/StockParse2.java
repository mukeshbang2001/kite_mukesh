
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
class Stock2 {
    Connection connection;
    String url;
    String seriesName;
    private int time;
    FileWriter fw;
    int x = 0;

    public Stock2(String seriesName, int time) throws IOException {
        fw = new FileWriter(new File(seriesName + ".txt"), true);

        this.seriesName = seriesName;
        this.time = time;
        url = MessageFormat.format(StockParse2.URL2, seriesName);
        connection = Jsoup.connect(url);
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

    public double getBankValue() throws IOException {
        Document document = connection.get();
        Elements element = document.body().getElementById("pnlGetQuote").children().get(2).children().get(0).child(0).child(1).getElementsByTag("td");
        Element element1 = element.get(0);
        String val = element1.text();
//        LocalDateTime now = LocalDateTime.now();
//
//        fw.append(now.getHour() + ":" + now.getMinute() + ":" + now.getSecond() + " | " + seriesName + " | " + val.toString() + "\n");
//        fw.flush();
        return Double.parseDouble(tmp(val.substring(0, val.indexOf('.') + 3)));

//        return new Random().nextDouble();
    }

    private String tmp(String input) {
        return input.replaceAll(",", "");
    }

}


public class StockParse2 {


    //    static String URL = "https://secure.icicidirect.com/IDirectTrading/Trading/FNO/GetQuoteData.aspx?FFO_XCHNG_CD=NFO&FFO_PRDCT_TYP=F&FFO_UNDRLYNG={0}&FFO_EXPRY_DT=29-Jun-2017&FFO_EXER_TYP=E&FFO_OPT_TYP=";
//    static String URL = "https://secure.icicidirect.com/IDirectTrading/Trading/FNO/GetQuoteData.aspx?FFO_XCHNG_CD=NFO&FFO_PRDCT_TYP=F&FFO_UNDRLYNG={0}&FFO_EXPRY_DT=30-Aug-2018&FFO_OPT_TYP=*&FFO_EXER_TYP=E";
    static String URL2 = "https://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxFOGetQuoteJSON.jsp?underlying={0}&instrument=FUTSTK&expiry=30AUG2018&type=SELECT&strike=SELECT";
    static FileWriter fw;

    public StockParse2() throws IOException {
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
                new Stock2(code, time).start();
            } catch (Exception e) {
                System.out.println("INvalid input.. ");
            }


        }

    }

}
