package com.markov.lab.service;

import com.markov.lab.entity.Month;
import com.markov.lab.entity.Period;
import com.markov.lab.input.PeriodInput;
import com.markov.lab.repository.MonthRepository;
import com.markov.lab.repository.PeriodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PeriodService {

    private final MonthRepository monthRepository;
    private final PeriodRepository periodRepository;

    PeriodService(MonthRepository monthRepository, PeriodRepository periodRepository) {
        this.monthRepository = monthRepository;
        this.periodRepository = periodRepository;
    }

    @Transactional
    public void savePeriod(PeriodInput period) {
        Period new_period = this.createPeriod(period);
        periodRepository.save(new_period);
    }

    private Period createPeriod(PeriodInput period) {
        List<Month> months = monthRepository.findByMonth(period.monthName());
        Period newPeriod = new Period();
        if (months.isEmpty()) {
            Month newMonth = new Month();
            newMonth.setMonth(period.monthName());
            Month createdMonth =  monthRepository.save(newMonth);
            newPeriod.setMonth(createdMonth);
        } else {
            newPeriod.setMonth(months.get(0));
        }
        System.out.println(period);
        newPeriod.setStartDate(period.startDate());
        newPeriod.setEndDate(period.endDate());
        newPeriod.setPeriodName(period.periodName());
        return newPeriod;
    }
}
